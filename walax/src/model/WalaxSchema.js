import { observable } from 'mobx'
import WalaxModel from './WalaxModel'
import WalaxManager from './WalaxManager'

import Logger from '../control/Logger'
const { d, a, e, i } = Logger.daei('model/WalaxSchema')

//todo schema versioning/collision detection/etc
export class WalaxSchema {
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

  constructor (url = false, models = false, name = false) {
    this.initialize()
    this._name = name
    if (url) this.load(url, models)
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

  get url () {
    return this._uri
  }

  set url (url) {
    this.load(url).then(() => {
      this._uri = url
    })
  }

  addModel (name, model) {
    a(this.checkModel(model), `invalid model registered: ${name}`)

    w.augment(this, name, { value: model }, true)

    w.augment(w.obj, name, { value: model }, true)
    this.models.set(name, model)
  }

  async load (url, models = false, servers = false) {
    //let url = new URL(url) // this will throw a TypeError if invalid
    this.initialize()
    this._uri = url
    models?.forEach?.((v, k) => this.addModel(k, v))
    this._servers = servers

    return w.net.get(url).then(data => this.parseData(url, data, models))
  }

  // getModelClass (name) {
  //   return this.models.get(name) || this._defaultModel
  // }

  // getModelManager (name) {
  //   cls = this.getModelClass(name)
  //   return w.cache.get(m => new cls.managerClass(cls), 'managers', cls)
  // }

  parseData (url, data, models = false) {
    throw new TypeError('schema class must implement parseData(data)')
  }
}
