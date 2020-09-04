import WalaxManager from './WalaxManager'

export default class WalaxModel {
  static _name = false
  static _fields = false
  static _primaryKey = false
  static _manager = false
  static _managerClass = WalaxManager
  _values = new Map()
  _dirty = new Set()
  _new = true
  _deleted = false

  static get fields () {
    return this._fields
  }

  static get manager () {
    this._manager ||= w.obj.getManager(this.managerClass, this)
    return this._manager
  }

  static get managerClass () {
    return this._managerClass
  }

  static get objects () {
    return this.manager
  }

  static checkManager (mgr) {
    return true // wixme
  }

  get fields () {
    return this.constructor._fields
  }

  constructor (data = false) {
    this.initFields(data)
  }

  get pk () {
    return this._values.get(this._primaryKey)
  }

  initFields (data = false, deleted = false) {
    // if (this.primaryKey && !(this.primaryKey in this.fields))
    //   this.fields[this._primaryKey] = -1
    console.log('fields', this.fields)
    console.log('data', data)
    if (Object.keys(this.fields).length)
      Object.keys(this.fields).forEach(fn => {
        this._defineField(fn, deleted)
      })
    Object.assign(this, data)
    console.log('done', this._values)
  }

  _defineField (field, deleted = false) {
    if (!field || field === 'undefined') return // FIXME why the string?
    //delete this[field]
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
    //todo: this could be static?
    return () => this._values.get(field)
  }

  //todo insert validation hooks
  _setField (field, val) {
    return val => {
      console.log('set', field, val)
      this._dirty.add(field)
      this._values.set(field, val)
    }
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
