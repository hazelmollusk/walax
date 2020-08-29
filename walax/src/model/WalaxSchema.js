import { observable } from 'mobx'
import WalaxModel from './WalaxModel'
import WalaxManager from './WalaxManager'

//todo schema versioning/collision detection/etc
export class WalaxSchema {
  schema = false
  title = false
  description = false
  version = false
  _uri = false
  _servers = false
  _defaultModel = WalaxModel
  _defaultManager = WalaxManager
  models = new Map()

  constructor (uri = false, models = false) {
    this.initialize()
    if (uri) this.load(uri, models)
  }

  initialize () {
    this.schema = false
    this.title = false
    this.description = false
    this.version = false
    this._uri = false
    this._servers = false
    this.models.clear()
  }

  checkModel (model) {
    if (!w.checkClass(WalaxModel, model)) return false
    return true
  }

  get uri () {
    return this._uri
  }

  set uri (uri) {
    this.load(uri).then( () => { this._uri = uri })
  }

  addModel (name, model) {
    w.assert(this.checkModel(model), `invalid model registered in ${name}`)

    w.augment(
      this,
      name,
      { value: model },
      true
    )

    w.augment(
      w.obj,
      name,
      { value: model },
      true
    )
    this.models.set(name, model)
  }

  async load (uri, models = false, servers = false) {
    //let url = new URL(uri) // this will throw a TypeError if invalid
    this.initialize()
    this._uri = uri
    models?.forEach?.((v, k) => this.addModel(k, v))
    this._servers = servers

    return w.net.get(uri).then(data => this.parseData(uri, data, models))
  }

  getModelClass (name) {
    return this.models.get(name) || this._defaultModel
  }

  getModelManager (name) {
    cls = this.getModelClass(name)
    return w.cache.get('managers', cls, m => {
      return new this._defaultManager(cls)
    })
  }

  parseData (uri, data, models = false) {
    throw new TypeError('schema class must implement parseData(data)')
  }
}
