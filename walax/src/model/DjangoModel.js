import WalaxModel from './WalaxModel'
import w from '../Walax'
import DjangoManager from './DjangoManager'

export default class DjangoModel extends WalaxModel {
  static _name = ''
  static _fields = {}
  static _primaryKey = 'xin'
  static _schemaUri = false
  static _modelUri = false
  static _managerClass = DjangoManager
  _values = new Map()
  _dirty = new Set()
  _new = true
  _uri = false

  constructor (name, fields) {
    super()
  }

  save () {
    if (!this._dirty.size) {
      w.log.info('save(): object unchanged, not saving')
      return this
    }
    if (this._deleted)
      throw new ReferenceError(`saving deleted model: ${this._name}.save()`)
    let saveFields = Object.fromEntries(this._values.entries())
    if (this._new) {
      w.net.post(this.modelUri, {}, saveFields, {}).then(ret => {
        this._new = false
        this._uri = ret.url
        this.updateProperties(this, ret)
      })
    } else {
      // ERROR CHECKING FOOL
      w.net
        .put(this.modelUri, {}, saveFields, {})
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
