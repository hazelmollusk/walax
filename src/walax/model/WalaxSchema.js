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
  name = false
  uri = false
  servers = false
  defaultManager = WalaxManager
  managers = new Map()
  models = new Map()

  constructor (url = false, name = false, models = false) {
    super(url)
    this.a(name || !url, `need a name for schema ${url}`)
    this._name = name
    this._models = models
    this.d(` Django schema ${name} (${url}) loaded`)
    if (url) this.load(url, models)
  }

  initialize () {
    this.schema = false
    this.title = false
    this.description = false
    this.version = false
    this.url = false
    this.servers = false
    this.models.clear()
  }

  createModel (name, fields, opts = undefined) {
    const schemaObject = this
    opts ||= {}
    const BaseModel = this.models?.get?.(name) || this._defaultModel
    this.d(
      `creating model class for ${name}`,
      { BaseModel },
      { fields },
      { opts }
    )

    const modelBase = class extends BaseModel {
      static _fields = fields
      static _name = name
      static _modelUrl = opts?.url
      static _schema = schemaObject

      get _schema () {
        return this.w.schema
      }
      get _fields () {
        return this.w.model.fields
      }
      get _modelCls () {
        return this.w.schema.models.get(name)
      }
      get _name () {
        return this.w.name
      }
      constructor (data = false) {
        super(data)
        this.initialize()
      }
      initialize (data) {
        this.d('initializing')
        this.w = {
          dirty: new Map(),
          values: new Map(),
          url: false,
          new: true,
          model: this,
          schema: schemaObject,
          values: new Map()
        }
      }
      get schema () {
        return this.w.schema
      }
      get model () {
        return modelCls
      }
      get modelName () {
        return this.model.name
      }
      _getField (field) {
        return () => this.w.values.get(field)
      }

      //todo insert validation hooks
      _setField (field, val) {
        return val => {
          let newVal = val
          this.w.dirty.add(field)
          this.w.values.set(field, val)
          return newVal
        }
      }
      toString () {
        return `${name} object`
      }
    }
    // classes[name]._fields = fields
    //classes[name]._schema = schemaObject
    this.d(`adding model ${name}`, modelBase._schema)
    this.addModel(name, modelBase)
  }

  checkModel (model) {
    if (!w.checkClass(WalaxModel, model)) return false
    return true
  }

  get url () {
    return this._url
  }

  set url (url) {
    this._url = url
  }

  addModel (name, model) {
    this.a(this.checkModel(model), `invalid model registered: ${name}`)
    this.d(`adding model ${name}`, { schema: this, model })
    w.augment(this, name, () => model)
    w.augment(w.obj, name, () => model)
    this.models.set(name, model)
  }

  load (url, models = false, servers = false) {
    //let url = new URL(url) // this will throw a TypeError if invalid
    this.initialize()
    models ||= this.models
    this.models ||= models
    models?.forEach?.((v, k) => this.addModel(k, v))
    this.url = url
    this.servers = servers
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
