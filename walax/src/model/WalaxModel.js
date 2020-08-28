import WalaxManager from "./WalaxManager"

export default class WalaxModel {
  _name = false
  _fields = false
  _values = new Map()
  _dirty = new Set()
  _primaryKey = false
  _new = true
  _deleted = false

  static _manager = false
  static _managerClass = WalaxManager
  
  static get objects () {
    if (!this._manager && this.checkManager(this._managerClass)) 
      this._manager = w.obj.getManager(this._managerClass, this)
    return this._manager
  }
  static checkManager(mgr) {
    return true  // wixme
  }

  constructor (initial = false) {}

  initFields (deleted = false) {
    console.log(this)
    if (this._primaryKey && !(this._primaryKey in this._fields))
      this._fields[this._primaryKey] = -1
    for (let field in this._fields) {
      this._defineField(field, deleted) // todo: actually look at field def, etc
    }
  }

  _defineField (field, deleted = false) {
    delete this[field]
    let desc = deleted
      ? {
          enumerable: true,
          configurable: false,
          get: () => {
            throw new ReferenceError(
              `access to deleted field: ${this._name}.${field}`
            )
          },
          set: val => {
            throw new ReferenceError(
              `access to deleted field: ${this._name}.${field}`
            )
          }
        }
      : {
          enumerable: true,
          configurable: true,
          get: this._getField(field),
          set: this._setField(field)
        }
    w.augment(this, field, desc)
  }

  _getField (field) {
    return () => this._values.get(field)
  }
  
  //todo insert validation hooks
  _setField (field) {
    return val => {
      this._dirty.add(field)
      this._values.set(field, val)
    }
  }

  updateProperties (obj) {
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
