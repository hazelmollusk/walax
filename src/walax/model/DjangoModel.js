import WalaxModel from './WalaxModel'
import w, { Walax } from '../Walax'
import DjangoManager from './DjangoManager'

import Logger from '../control/Logger'

/**
 * DjangoModel
 * @class
 */
export default class DjangoModel extends WalaxModel {
  static _primaryKey = 'xin'
  static _managerClass = DjangoManager
  

  /**
   * builds a new DjangoModel
   * @class
   * @classdesc a WalaxModel backed by Django Rest Framework
   * @param {*} data
   */
  constructor (data) {
    super(data)
    this.initFields(data)
  }

  static get primaryKey () {
    return this.hyper ? 'url' : 'xin'
  }

  initFields (data = false, deleted = false) {
    super.initFields(data, deleted)
  }

  get modelUrl () {
    return this.constructor.url
  }

  save () {
    if (!this._dirty.size) {
      this.d('save(): object unchanged, not saving')
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
    this.a(!this._deleted, `deleting deleted model: ${this._name}.delete()`)
    w.net.delete(this.modelUri).then(ret => {
      this._deleted = true
      this._uri = false
      this._values.clear()
      this.initFields(true)
    })
  }
}
