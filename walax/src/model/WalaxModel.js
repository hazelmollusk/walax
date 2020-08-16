export default class WalaxModel {
  _name = false
  _fields = false
  _values = new Map()
  _dirty = new Set()
  _new = true

  constructor (initial = false) {}

  initFields () {
    for (let field in this._fields) {
      console.log(`augmenting ${field}`)
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

  save () {
    throw new TypeError('model class must implement save()')
  }

  delete () {
    throw new TypeError('model class must implement delete()')
  }
}
