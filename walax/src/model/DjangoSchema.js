import WalaxModel from './WalaxModel'
import { observable } from 'mobx'
import { WalaxSchema } from './WalaxSchema'
import DjangoModel from './DjangoModel'
import DjangoManager from './DjangoManager'
import w from '../Walax'

export class DjangoSchema extends WalaxSchema {
  _defaultModel = DjangoModel
  _defaultManager = DjangoManager

  constructor (uri = false, models = false) {
    super(uri, models)
  }

  getManager(model) {
    // allows instances/names to be passed in
    if (typeof model == 'string') model = this.models.get(model)
    if (model?._model) model = model._model

    return w.cache.find('managers', model, m => {
      let mgrClass = `${m._name}Manager`
      if (this.models.has(mgrClass)) 
        return new mgrClass(m)
      return new this._defaultManager(model)
    })
  }
  // uri in this case is expected to be a DRF API root URL

  async parseData (uri, data, models) {
    w.net.options(uri).then(info => {
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

        fields[this._primaryKey] = -1
        let BaseModel = models?.get?.(modelClassName) || this._defaultModel
        let classes = {}
        classes[modelClassName] = class extends BaseModel {
          _fields = fields
          _name = modelClassName
          _modelUri = modelRootUri
          _schemaUri = uri
          _uri = false
          _new = true

          static get schema() { return schemaObject }
          static get objects() {
            return schemaObject.getManager(modelClassName)
          }

          constructor (data = false) {
            super()
            this.initFields()
          }
        }
          
        classes[modelClassName]._model = classes[modelClassName]

        this.addModel(modelClassName, classes[modelClassName])
        
      })
    }
  }
}
