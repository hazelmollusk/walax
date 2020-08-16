import { observable } from 'mobx'
import WalaxModel from './WalaxModel'

//todo schema versioning/collision detection/etc
export class WalaxSchema {
  schema = false
  title = false
  description = false
  version = false
  _uri = false
  _servers = false
  _defaultModel = WalaxModel
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
    if (!(model instanceof WalaxModel)) return false
    return true
  }

  get uri () {
    return this._uri
  }

  set uri (uri) {
    this.load(uri)
  }

  addModel (name, model) {
    if (!this.checkModel(model))
      throw new TypeError(`invalid model registered in ${name}`)

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

  parseData (uri, data, models = false) {
    throw new TypeError('schema class must implement parseData(data)')
  }
}
