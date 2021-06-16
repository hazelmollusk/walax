import Schema from '../Schema'
import DjangoModel from './DjangoModel'
import DjangoManager from './DjangoManager'
import w from '../../Walax'

const camelCase = (s) => {
    if (!s || typeof s !== 'string') return ''
    let parts = s.split('_')
    for (let n in parts)
        parts[n] = parts[n].charAt(0).toUpperCase() + parts[n].slice(1)
    return parts.join('')
}

export class DjangoSchema extends Schema {
    defaultModel = DjangoModel
    defaultManager = DjangoManager

    constructor(url, name = false, models = false) {
        super(url, name, models)
        this.fields = {}
    }

    initSchema(data) { }

    getManager(model) {
        // allows instances/names to be passed in
        if (typeof model == 'string') model = this.models.get(model)
        if (model?._model) model = model._model
        return w.cache.find('managers', model, m => {
            let mgrClass = `${m._w.modelClassName}Manager`
            if (this.models.has(mgrClass)) return new mgrClass(m)
            return new this.defaultManager(model)
        })
    }

    toString() {
        return `django schema ${this.name}`
    }

    init(data) {
        super.init(data)
    }

    async loadUrl(url) {
        // FIXME hack
        let modelsUrl = url + 'models/'
        this.d(`loadUrl ${url}`, { modelsUrl })
        w.net.options(modelsUrl).then(info => {
            this.d(`receiving data for ${url}`, info)
            this.url = url
            this.modelsUrl = modelsUrl
            this.title = info.name || 'Untitled'
            this.description = info.description || ''
            this.schema = info
        })
        return w.net.get(modelsUrl).then(data => {
            this.d('retrieved schema data', data)
            for (let modelName in data) {
                let modelRootUri = data[modelName]
                w.net.options(modelRootUri).then(modelInfo => {
                    this.d(`retrieved options for model ${modelName}`, modelInfo)
                    let fields = modelInfo.actions.POST
                    let modelClassName = camelCase(modelName)
                    // let modelClassName = modelInfo.name
                    //     .replace(' List', '')
                    //     .replace(' ', '')
                    let opts = {
                        url: modelRootUri,
                        fields: fields,
                        name: modelClassName
                    }

                    let m = this.createModel(modelClassName, opts)
                    this.fields[modelClassName] = fields
                    m.modelUrl = modelRootUri
                    this.d(`created model class ${modelClassName}`, {opts, m})
                })
            }
        })
    }
}
