export default class WalaxModel {
  _name = ''
  _fields = {}
  _values = new Map()
  _dirty = new Set()
  _new = true

  constructor (name, fields) {
    this._name = name
    this._fields = fields
    for (field in fields) {
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
      this._dirty.add(field)
      this._values.set(field, val)
    }
  }
  save () {
    throw new TypeError('model class must implement save()')
  }
  delete () {
    throw new TypeError('model class must implement delete()')
  }
}
