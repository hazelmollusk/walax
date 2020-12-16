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

  loadUrl (url) {
    this.e('schema class must implement loadUrl')
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

  addModel (name, model) {
    this.a(this.checkModel(model), `invalid model registered: ${name}`)
    this.d(`adding model ${name}`, { schema: this, model })
    w.augment(this, name, () => model)
    w.augment(w.obj, name, () => model)
    this.models.set(name, model)
  }

  checkModel (model) {
    if (!w.checkClass(WalaxModel, model)) return false
    return true
  }

  initSchema (data) {
    this.a(false, 'initSchema not implemented')
  }

  createModel (name, fields, opts = undefined) {
    const schemaObject = this
    const BaseModel = this.models?.get?.(name) || this._defaultModel

    this.d(
      'createModel',
      { name },
      { fields },
      { opts },
      { schemaObject },
      { BaseModel }
    )
    opts ||= {}
    this.d(
      `creating model class for ${name}`,
      { BaseModel },
      { fields },
      { opts }
    )

    const classes = {}
    class walaxifiedModel extends BaseModel {
      constructor (data = false) {
        super(data)
        this.initModel(data)
      }

      get _walaxModel () {
        return schemaObject.models.get(name)
      }
      initModel (data) {
        let s = schemaObject,
          n = name

        // so as to not muddy the model's namespace too much
        this._w = {
          dirty: new Set(),
          values: new Map(),
          url: false,
          new: true,
          fields: fields,
          schema: s,
          name: n,
          values: new Map()
        }
        this.d('initModel')
        if (Object.keys(this._w.fields).length) {
          this.d(`adding fields to ${n}`)
          Object.keys(this._w.fields).forEach(fname => {
            this.d(`field ${fname}`)
            w.augment(this, fname, this._getField(fname), this._setField(fname))
            //FIXME at the very least per-type
            w[fname] = false
          })
          // if (data) Object.assign(this, data)
        }
      }

      _getField (field) {
        return () => this._w.values.get(field)
      }

      _setField (field) {
        return val => {
          let newVal = val
          this._w.dirty.add(field)
          this._w.values.set(field, newVal)
          return newVal
        }
      }

      toString () {
        return `${name} object`
      }
    }
    this.d(`adding model ${name}`, walaxifiedModel._schema)
    this.addModel(name, walaxifiedModel)
  }

  get url () {
    return this._url
  }

  set url (url) {
    this._url = url
  }

  // getModelClass (name) {
  //   return this.models.get(name) || this._defaultModel
  // }

  // getModelManager (name) {
  //   cls = this.getModelClass(name)
  //   return w.cache.get(m => new cls.managerClass(cls), 'managers', cls)
  // }
}
