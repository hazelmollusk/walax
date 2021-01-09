import { observable } from 'mobx'
import Model from './Model'
import Manager from './Manager'
import w from '../Walax'
import Entity from '../util/Entity'

//todo schema versioning/collision detection/etc
export default class Schema extends Entity {
  schema = false
  title = false
  description = false
  version = false
  name = false
  uri = false
  servers = false
  defaultManager = Manager
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

  // TODO may need an updateModel() if PUT and POST differ (so fields changes)
  addModel (name, model) {
    this.a(this.checkModel(model), `invalid model registered: ${name}`)
    this.d(`adding model ${name}`, { schema: this, model })
    w.augment(this, name, () => model)
    w.augment(w.obj, name, () => model)
    this.models.set(name, model)
  }

  checkModel (model) {
    if (!w.checkClass(Model, model)) return false
    return true
  }

  initSchema (data) {
    this.a(false, 'initSchema not implemented')
  }

  createModel (name, opts = undefined) {
    const schemaObject = this
    const BaseModel = this.models?.get?.(name) || this._defaultModel
    opts ||= {}

    this.d('createModel', { name }, { opts }, { schemaObject }, { BaseModel })
    opts ||= {}
    this.d(`creating model class for ${name}`, { BaseModel }, { opts })

    const classes = {}
    class walaxifiedModel extends BaseModel {
      constructor (data = false) {
        super(data)
        this._initModel(data)
        this.d('built an object', { obj: this }, { data })
      }

      get _walaxModel () {
        return schemaObject.models.get(name)
      }
      get _walaxUrlNew () {
        return this._w.urlNew
      }
      get _walaxUrl () {
        return this._w.new ? this._w.urlNew : this._w.url
      }
      get _walaxFields () {
        return this._w.new ? this._w.fieldsNew : this._w.fields
      }

      _initModel (data) {
        let s = schemaObject,
          n = name

        // so as to not muddy the model's namespace too much
        this._w = {
          dirty: new Set(),
          values: new Map(),
          urlNew: false,
          url: false,
          new: true,
          fieldsNew: opts?.fieldsNew || opts?.fields,
          fields: opts?.fields,
          schema: s,
          name: n,
          values: new Map()
        }
        if (opts != undefined) Object.assign(this._w, opts)
        this.d('initModel')
        if (Object.keys(this._w.fields).length) {
          this.d(`adding fields to ${n}`)
          Object.keys(this._w.fields).forEach(fn => {
            this.d(`field ${fn}`)
            w.augment(
              this,
              fn,
              this._walaxGetField(fn),
              this._walaxGetField(fn)
            )
            //FIXME at the very least per-type
            w[fn] = undefined
            this._setFieldDefault(fn)
          })
          if (data) Object.assign(this, data)
        }
      }

      _validateFields () {
        return true
      }

      _setFieldDefault (field) {
        this._w.values[field] = undefined

        let fd = this._w.fields[field]
        switch (fd.type) {
        }
        return true
      }

      _walaxGetField (field) {
        if (this._getField) return this._getField(field)
        return () => this._w.values.get(field)
      }

      _walaxGetField (field) {
        return val => {
          if (this._walaxSetField) return this._setField(field)
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
}
