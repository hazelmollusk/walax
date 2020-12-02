import WalaxModel from './WalaxModel'
import w, { Walax } from '../Walax'
import DjangoManager from './DjangoManager'

import Logger from '../control/Logger'
const { d, a, e, i } = Logger.daei('Auth')

/**
 * DjangoModel
 * @class 
 */
export default class DjangoModel extends WalaxModel {
  static _primaryKey = 'xin'
  static _managerClass = DjangoManager
  static _hyper = false

  /**
   * builds a new DjangoModel
   * @class
   * @classdesc a WalaxModel backed by Django Rest Framework
   * @param {*} data
   */
  constructor (w, data) {
    super(w, data)
  }

  static get primaryKey () {
    return this.hyper ? 'url' : 'xin'
  }

  static get hyper () {
    return this._hyper
  }

  initFields (data = false, deleted = false) {
    super.initFields(data, deleted)

    this._hyper = this.fields.has('url')
  }

  get url () {
    //fixme?
    return this.hyper ? this.url : [this.modelUrl, this.pk].join('/')
  }

  get hyper () {
    return this.constructor.hyper
  }

  get modelUrl () {
    return this.constructor.url
  }

  save () {
    if (!this._dirty.size) {
      d('save(): object unchanged, not saving')
      return this
    }
    a(!this._deleted, `saving deleted model: ${this._name}.save()`)
    let saveFields = Object.fromEntries(this._values.entries())
    if (this._new) {
      w.net.post(this.modelUri, {}, saveFields, {}).then(ret => {
        this._new = false
        this._uri = this.hyper ? ret.url : '/'.join(this.modelUri, this.pk)
        this.updateProperties(this, ret)
      })
    } else {
      // ERROR CHECKING FOOL
      w.net
        .put(this.url, {}, saveFields, {})
        .then(ret => this.updateProperties(ret))
    }
    return this
  }

  delete () {
    if (this._deleted)
      throw new ReferenceError(`deleting deleted model: ${this._name}.delete()`)
    w.net.delete(this.modelUri).then(ret => {
      this._deleted = true
      this._uri = false
      this._values.clear()
      this.initFields(true)
    })
  }
}
