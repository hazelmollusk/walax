import Control from './Control'
import w from '../Walax'
import { observable } from 'mobx'
import { WalaxSchema } from '../model/WalaxSchema'
import { OpenApiSchema } from '../model/OpenApiSchema'

class ObjectControl extends Control {
  /**
   *Creates an instance of ObjectControl.
   * @param {boolean} [key=false]
   * @memberof ObjectControl
   *
   * ObjectControl(key) uses the value passed
   * as a URI for the base schema to load.
   */
  constructor (key = false) {
    super()
    this._init(true)
  }

  _init (full = false) {
    if (full) this.schema = observable.map()
    this._ops = null
    this._models = null
    this._modelNames = null
    this._managers = null
    this._status = null
  }

  loadSchema (schema, name) {
    // pre-built WalaxSchema
    // todo checking, implement
  }

  loadUri (uri, name = false, replace = false) {
    w.log.warn('purging model schema')
    w.log.info(`loading model schema: ${uri}`)
    this._init(replace)
    this.schema.set(name || uri, new OpenApiSchema(uri))
  }

  schema (name) { return this.schema.get(name) }

  get ops () {
    if (!this._ops) {
      this._ops = observable.map()
      this.schema.forEach((v, k) =>
        v.ops.forEach((vv, kk) => this._ops.set(kk, vv))
      ) // todo collision detection
    }

    return this._ops
  }

  get models () {
    if (!this._models) {
      this._models = observable.map()
      this.schema.forEach((v, k) =>
        v.models.forEach((vv, kk) => this._models.set(kk, vv))
      ) // todo collision detection
      // currently last-set wins
    }
    return this._models
  }
}

export default ObjectControl
