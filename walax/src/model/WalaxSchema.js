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
  _customModels = false
  models = observable.map()

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
    this._customModels = false
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

  load (uri, models = false, servers = false) {
    //let url = new URL(uri) // this will throw a TypeError if invalid
    this.initialize()
    this._uri = uri
    this._customModels = models
    this._servers = servers

    w.net.get(uri).then(data => this.parseData(data, models))
  }

  getModelClass (name) {
    return WalaxModel
  }

  parseData (data) {
    throw new TypeError('schema class must implement parseData(data)')
  }
}
