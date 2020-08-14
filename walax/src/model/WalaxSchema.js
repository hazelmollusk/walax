import WalaxModel from './WalaxModel'

//todo schema versioning/collision detection/etc
export class WalaxSchema {
  schema = false
  title = false
  description = false
  version = false
  _uri = false
  _url = false
  _servers = false
  _customModels = false
  models = observable.map()

  constructor (uri = false, models = false) {
    this.initialize()
    if (uri) this.loadURI(uri, models)
  }

  initialize () {
    this.schema = false
    this.title = false
    this.description = false
    this.version = false
    this._uri = false
    this._url = false
    this._servers = false
    this._customModels = false
    models.clear()
  }

  checkModel (model) {
    if (!(model instanceof WalaxModel)) return false
    return true
  }

  get uri () {
    return this._uri
  }

  set uri (uri) {
    this.loadURI(uri)
  }

  loadURI (uri, models = false) {
    let url = new URI(uri) // this will throw a TypeError if invalid
    this.initialize()
    this._uri = uri
    this._url = url

    if (!models || !this.parseModels(models))
      throw new TypeError(`invalid models: ${uri}`)

    w.net.get(uri).then(data => this.parseData(data, models))
  }

  parseModels (models) {
    if (!models) return true
    models.forEach((v, k) => {
      if (!w.isValidProp(k)) 
        throw new TypeError(`invalid name for model ${k}`)
      if (!this.checkModel(v))
        throw new TypeError(`custom model ${k} is not a WalaxObject`)
    })
    this._customModels = models
    return true
  }

  getModelClass (name) {
    return WalaxModel
  }

  parseData (data) {
    throw new TypeError('schema class must implement parseData(data)')
  }
}
