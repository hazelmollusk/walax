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
  url = false
  defaultManager = Manager
  defaultModel = Model
  managers = new Map()
  models = new Map()

  constructor (name, url, models = {}) {
    super()
    this.a(name || !url, `need a name for schema ${url}`)
    this.name = name
    this.d(`Django schema ${name} (${url}) loading`)
    this.initialize(models)
    if (url) this.load(name, url, models)
  }

  initialize (models = {}) {
    this.schema = false
    this.title = false
    this.description = false
    this.version = false
    this.url = false
    this.servers = false
    this.models = {}
  }

  importModels (models) {
    // TODO: this
  }

  loadUrl (url) {
    this.e('schema class must implement loadUrl')
  }

  load (name, url, models = {}, servers = false) {
    //let url = new URL(url) // this will throw a TypeError if invalid
    this.initialize(models)
    this.d(`${name}: ${url}`)
    models ||= this.models
    this.models ||= models
    models?.forEach?.(v => this.addModel(v, models[v]))
    this.url = url
    this.servers = servers
    return this.loadUrl(url)
  }

  checkModel (model) {
    if (!w.isSubclassOf(Model, model)) return false
    return true
  }

  initSchema (data) {
    this.a(false, 'initSchema not implemented')
  }

  // TODO: move a lot of this logic to DjangoSchema
  createModel (name, opts = undefined) {
    let baseModel = this.models[name] || this.defaultModel
    this.a(baseModel, 'no base model to use')
    this.a(w.isValidProp(name), 'invalid name', name)

    eval(`this.models[name] = class ${name} extends baseModel {}`)

    this.a(
      this.checkModel(this.models[name]),
      `invalid model registered: ${name}`
    )
    this.a(!w.obj.models.has(name), `model ${name} already exists!`)
    this.d(`creating model ${name}`, {
      schema: this,
      model: this.models[name]
    })

    this.models[name]._meta ||= {}
    if (opts) for (let opt in opts) this.models[name]._meta[opt] = opts[opt]
    this.models[name].modelName = name
    if (opts.methods) {
      this.createMethods(name, opts.methods)
    }
    if (opts.fields) {
      this.createFields(name, opts.fields)
    }

    w.augment(this, name, () => this.models[name])
    w.augment(w.obj, name, () => this.models[name])
    // w.obj.models.set(name, this.models[name])

    this.d('created model', this.models[name])
    return this.models[name]
  }

  createFields (name, fields) {
    for (let fn in fields) {
      let getter = function () {
        return this._getField(fn)
      }
      let setter = function (val) {
        return this._setField(fn, val)
      }
      w.augment(this.models[name].prototype, fn, getter, setter)
    }
  }

  createMethods (name, methods) {
    for (let fn of methods) {
      this.d('installing method', { name, fn })
      this.a(w.isValidProp(fn.name))
      async function remoteMethod (params, data) {
        this.i(`calling remote method ${fn.name}`, { params, data })
        this.a(this.url, 'attempted rpc with unsaved object!')
        return w.net[fn.method]([this.url, fn.name, '/'].join(''), params, data)
      }
      // Object.defineProperty(this.models[name], fn.name, { value: remoteMethod })
      this.models[name].prototype[fn.name] = remoteMethod
    }
  }
}
