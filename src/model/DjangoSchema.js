import WalaxModel from './WalaxModel'
import { observable } from 'mobx'
import { WalaxSchema } from './WalaxSchema'
import DjangoModel from './DjangoModel'
import DjangoManager from './DjangoManager'
import w from '../Walax'
import Logger from '../control/Logger'

let f = 'djangoSchema'
const { d, a, e, i } = Logger.daei(f)

export class DjangoSchema extends WalaxSchema {
  _defaultModel = DjangoModel
  _defaultManager = DjangoManager

  constructor (w, url = false, models = false) {
    super(w, url, models)
  }

  getManager (model) {
    // allows instances/names to be passed in
    if (typeof model == 'string') model = this.models.get(model)
    if (model?._model) model = model._model
    w.debug(model)
    return w.cache.find('managers', model, m => {
      let mgrClass = `${m._name}Manager`
      if (this.models.has(mgrClass)) return new mgrClass(m)
      return new this._defaultManager(model)
    })
  }
  // url in this case is expected to be a DRF API root URL

  async parseData (url, data, models) {
    w.net.options(url).then(info => {
      this.title = info.name || 'Untitled'
      this.description = info.description || ''
    })
    let schemaObject = this
    /* initial data will be model (plural) -> URL (we hope) */
    for (let modelName in data) {
      let modelRootUri = data[modelName]
      w.net.options(modelRootUri).then(modelInfo => {
        // works if you have a very generic DRF setup... todo
        let modelClassName = modelInfo.name
          .replace(' List', '')
          .replace(' ', '')

        let fields = modelInfo.actions.POST

        // fields[this._primaryKey] = -1
        d(`creating model class for ${modelName}:`, fields)
        let BaseModel = models?.get?.(modelClassName) || this._defaultModel
        let classes = {}
        classes[modelClassName] = class extends BaseModel {
          static _fields = fields
          static _name = modelClassName
          static _modelUri = modelRootUri
          static _schemaUri = url
          static _schema = schemaObject
          _uri = false
          _new = true

          constructor (data = false) {
            super(data)
          }

          static get schema () {
            return this._schemaObject
          }
        }

        classes[modelClassName]._model = classes[modelClassName]

        this.addModel(modelClassName, classes[modelClassName])
      })
    }
  }
}
