import Schema from '../Schema'
import DjangoModel from './DjangoModel'
import DjangoManager from './DjangoManager'
import w from '../../Walax'

const camelCase = s => {
  if (!s || typeof s !== 'string') return ''
  let parts = s.split('_')
  for (let n in parts)
    parts[n] = parts[n].charAt(0).toUpperCase() + parts[n].slice(1)
  return parts.join('')
}

export class DjangoSchema extends Schema {
  defaultModel = DjangoModel
  defaultManager = DjangoManager

  constructor (url, name = false, models = false) {
    super(url, name, models)
    this.fields = {}
  }

  getManager (model) {
    // allows instances/names to be passed in
    if (typeof model == 'string') model = this.models.get(model)
    if (model?._model) model = model._model
    return w.cache.find('managers', model, m => {
      let mgrClass = `${m._meta.modelClassName}Manager`
      if (this.models.has(mgrClass)) return new mgrClass(m)
      return new this.defaultManager(model)
    })
  }

  toString () {
    return `django schema ${this.name}`
  }

  init (data) {
    super.init(data)
  }

  processModels () {
    for (let modelName in this.models) {
      let model = this.models[modelName]
      this.d('processing', modelName, model, this.models)
      for (let fn in model.fields) {
        let field = model.fields[fn]
        if (field.type == 'related') {
          let relatedName = field.related_name
          relatedName ||= modelName.toLowerCase() + '_set'
          this.d(`adding ${field.model}.${relatedName.toLowerCase()}`)

          let targetModel = this.models[field.model]
          this.d('targetModel', { targetModel, field }, this.models)
          targetModel.relatedQueries ||= {}
          let queryField = `${fn}_id`
          let getQuery = function () {
            if (this.pk) {
              let filter = {}
              filter[queryField] = this.pk
              let query = model.objects.filter(filter)
              return query
            }
            return []
          }
          targetModel.relatedQueries[relatedName] = getQuery
        }
      }
    }
  }

  loadUrl (url) {
    // FIXME hack
    this.d('Django loadUrl', url)
    if (!url.endsWith('/')) url += '/'
    let modelsUrl = url + 'models/'
    this.d(`loadUrl ${url}`, { modelsUrl })
    w.net.options(modelsUrl).then(info => {
      this.d(`receiving info for ${url}`, info)
      this.url = url
      this.modelsUrl = modelsUrl
      // this.title = info.name || 'Untitled'
      this.description = info.description || ''
      this.schema = info
    })
    return w.net.get(modelsUrl).then(data => {
      this.d('retrieved schema data', data)
      let modelPromises = []
      for (let modelName in data) {
        let modelRootUri = data[modelName]
        modelPromises.push(
          w.net.options(modelRootUri).then(modelInfo => {
            this.d(`retrieved options for model ${modelName}`, modelInfo)
            let fields = modelInfo.actions.POST
            let modelClassName = camelCase(modelName)
            let opts = {
              modelUrl: modelRootUri,
              fields: fields,
              modelName: modelClassName,
              methods: modelInfo.extra_actions,
              schema: this
            }
            this.d('model options', opts)
            let m = this.createModel(modelClassName, opts)
            m.modelUrl = modelRootUri

            for (let fn in fields)
              if (fields[fn]['primary_key'] == 'true') {
                m.pk = fn
                break
              }
            if (!m.pk && fields['url'] == undefined) this.e('no primary key', m)

            this.d(`created model class ${modelClassName}`, { opts, m })
          })
        )
      }
      Promise.all(modelPromises).then(x => {
        this.d('PROCESSING MODELS')
        return this.processModels()
      })
    })
  }
}
