import WalaxManager from './WalaxManager'
import WalaxEntity from '../util/WalaxEntity'
import w from '../Walax'

export default class WalaxModel extends WalaxEntity {
  static _name = false
  static _url = false
  static _fields = new Map()
  static _primaryKey = false
  static _managerClass = WalaxManager
  static _schema = false

  _values = new Map()
  _dirty = new Set()
  _new = true
  _deleted = false
  _init = false

  constructor (w, data = false) {
    super(w, data)
    this.initFields(data)
  }

  static get schema () {
    return this._schema
  }

  static get fields () {
    return this._fields
  }

  static get manager () {
    return w.obj.getManager(this, this.managerClass)
  }

  static get managerClass () {
    return this._managerClass
  }

  static get objects () {
    return this.manager
  }

  get fields () {
    return this.constructor.fields
  }

  get pk () {
    return this._values.get(this.primaryKey)
  }

  get primaryKey () {
    return this._primaryKey
  }

  initFields (data = false, deleted = false) {
    if (this._init) {
      this.d('re-init, exiting')
      return
    }
    // if (this.primaryKey && !(this.primaryKey in this.fields))
    //   this.fields[this._primaryKey] = -1
    this.d('initializing fields', this.fields, data)
    if (Object.keys(this.fields).length)
      Object.keys(this.fields).forEach(fn => {
        w.augment(
          this,
          fn,
          () => this._getField(fn),
          v => this._setField(fn, v)
        )
        this._defineField(fn, deleted)
      })
    if (data) Object.assign(this, data)
    this.d('finished initializing', this)
    this._init = true
  }

  _defineField (field, deleted = false) {
    if (!field || field === 'undefined') return // FIXME why the string?

    w.augment(this, field, this._getField(field), this._setField(field))
  }

  _getField (field) {
    return () => this._values.get(field)
  }

  //todo insert validation hooks
  _setField (field) {
    return val => {
      this.d('set', this, field, val)
      let newVal = val
      this._dirty.add(field)
      this._values.set(field, val)
      return newVal
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
