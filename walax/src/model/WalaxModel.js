export default class WalaxModel {
  _name = false
  _fields = false
  _values = new Map()
  _dirty = new Set()
  _primaryKey = false
  _new = true

  constructor (initial = false) {}

  initFields () {
    if (this._primaryKey && !(this._primaryKey in this._fields))
      this._fields[this._primaryKey] = -1
    for (let field in this._fields) {
      w.augment(this, field, {
        enumerable: true,
        configurable: false,
        get: this._getField(field),
        set: this._setField(field)
      })
    }
  }

  _getField (field) {
    return () => this._values.get(field)
  }

  _setField (field) {
    return val => {
      this._dirty.add(field)
      this._values.set(field, val)
    }
  }

  updateProperties (obj) {
    console.log('updateProps', this, obj)
    Object.assign(this, obj)
  }

  getUri () {
    throw new TypeError('model class must implement getUri()')
  }

  save () {
    throw new TypeError('model class must implement save()')
  }

  delete () {
    throw new TypeError('model class must implement delete()')
  }
}
