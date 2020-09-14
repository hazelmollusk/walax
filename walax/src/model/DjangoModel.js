import WalaxModel from './WalaxModel'
import w from '../Walax'
import DjangoManager from './DjangoManager'

import Logger from '../control/Logger'
const { d, a, e, i } = Logger.daei('Auth')

export default class DjangoModel extends WalaxModel {
  static _primaryKey = 'xin'
  static _schemaUri = false
  static _modelUri = false
  static _managerClass = DjangoManager
  static _hyper = false

  constructor (data) {
    super(data)
  }

  static get primaryKey () {
    return this.hyper ? 'url' : 'xin'
  }

  get url () {
    //fixme?
    return this.hyper ? this.url : '/'.join([this.modelUri, this.pk])
  }

  get modelUri () {
    return this.__prototype__.uri
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
        .put(this.uri, {}, saveFields, {})
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
