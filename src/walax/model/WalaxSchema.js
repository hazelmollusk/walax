import { observable } from 'mobx'
import WalaxModel from './WalaxModel'
import WalaxManager from './WalaxManager'
import w from '../Walax'
import WalaxEntity from '../util/WalaxEntity'

//todo schema versioning/collision detection/etc
export class WalaxSchema extends WalaxEntity {
  schema = false
  title = false
  description = false
  version = false
  _name = false
  _uri = false
  _servers = false
  _defaultModel = WalaxModel
  _defaultManager = WalaxManager
  managers = new Map()
  models = new Map()

  constructor (url = false, name = false, models = false) {
    super()
    this.a(name || !url, `need a name for schema ${url}`)
    this._name = name
    this._models = models
    this.d(` Django schema ${name} (${url}) loaded`)
    if (url) this.load(url, models)
  }

  init () {
    this.schema = false
    this.title = false
    this.description = false
    this.version = false
    this._uri = false
    this._servers = false
    this.models.clear()
  }

  createModel (name, fields, opts = undefined) {
    let schemaObject = this
    opts ||= {}
    let BaseModel = this.models?.get?.(name) || this._defaultModel
    this.d(`creating model class for ${name}`, fields, opts)
    let classes = {}
    this.d('base model', BaseModel)
    classes[name] = class extends BaseModel {
      static _fields = fields
      static _name = name
      static _modelUrl = opts?.url
      static _schema = schemaObject

      _url = false
      _new = true
      _modelName = name
      _schema = schemaObject
      _values = new Map()

      constructor (data = false) {
        super(data)
        this._schema = schemaObject
        this._modelName = name
      }

      toString () {
        return `${name} object`
      }
    }
    classes[name]._model = classes[name]
    classes[name]._fields = fields
    classes[name]._schema = schemaObject
    this.d(`adding model ${name}`, classes[name]._schema)
    this.addModel(name, classes[name])
  }

  _init () {
    console.log('INITNINTINTINIT')
  }

  checkModel (model) {
    if (!w.checkClass(WalaxModel, model)) return false
    return true
  }

  get url () {
    return this._uri
  }

  set url (url) {
    this.load(url).then(() => {
      this._uri = url
    })
  }

  addModel (name, model) {
    this.a(this.checkModel(model), `invalid model registered: ${name}`)
    this.d(`adding model ${name}`, model)
    w.augment(this, name, () => model)
    w.augment(w.obj, name, () => model)
    this.d('NO HERE', model._schema)
    this.models.set(name, model)
  }

  load (url, models = false, servers = false) {
    //let url = new URL(url) // this will throw a TypeError if invalid
    this._uri = url
    models ||= this._models
    this._models ||= models
    models?.forEach?.((v, k) => this.addModel(k, v))
    this._servers = servers
    console.log('going in')
    this.d('DJ')
    return this.loadUrl(url)
  }

  // getModelClass (name) {
  //   return this.models.get(name) || this._defaultModel
  // }

  // getModelManager (name) {
  //   cls = this.getModelClass(name)
  //   return w.cache.get(m => new cls.managerClass(cls), 'managers', cls)
  // }

  loadUrl (url) {
    this.e('schema class must implement loadUrl')
  }
}
