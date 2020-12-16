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
    //this.initFields(data)
  }

  get url () {
    return this._w.url
  }
  set url (v) {
    this._w.url = v
  }

  initModel (data = false) {}

  initFields (data = false, deleted = false) {
    super.initFields(data, deleted)
  }

  updateFields (data) {
    this.d('updateFields', data)
    Object.assign(this, data)
  }

  save () {
    if (!this._w.dirty.size) {
      this.d('save(): object unchanged, not saving')
      return this
    }
    this.a(!this._w.deleted, `saving deleted model: ${this.toString()}.save()`)
    let saveFields = Object.fromEntries(this._w.values.entries())
    if (this._w.new) {
      w.net.post(this._walaxUrlNew, {}, saveFields, {}).then(ret => {
        this._w.new = false
        this._w.url = ret.url || '/'.join(this._w._urlNew, this.pk)
        this.updateFields(ret)
      })
    } else {
      // ERROR CHECKING FOOL
      w.net
        .put(this._walaxUrl, {}, saveFields, {})
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
