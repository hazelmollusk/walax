import WalaxModel from './WalaxModel'
import w from '../Walax'

export default class DjangoModel extends WalaxModel {
  _name = ''
  _fields = {}
  _values = new Map()
  _dirty = false
  constructor (name, fields) {
    super()
    this._name = name
    this._fields = fields
    for (field in fields) {
      console.log(`${name}:${field}`)
      w.augment(this, field, {
        enumerable: true,
        configurable: false,
        get: this._getField(field),
        set: this._setField(field)
      })
    }
  }
  _getField (field) {
    return () => this._values[field]
  }
  _setField (field) {
    return val => {
      this._dirty = true
      this._values[field] = val
    }
  }
}
