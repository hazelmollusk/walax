import WalaxManager from './WalaxManager'
import WalaxEntity from '../util/WalaxEntity'
import w from '../Walax'

export default class WalaxModel extends WalaxEntity {
  static _name = false
  static _url = false
  static _fields = new Map()
  static _primaryKey = false
  static _schema = false
  static _manager = false
  static _primaryKey = false

  _modelCls = false
  _values = new Map()
  _dirty = new Set()
  _new = true
  _deleted = false
  _init = false

  constructor (data = false) {
    super()
    this.initFields(data)
  }

  get _model () {
    this.d('model class access', this._modelCls)
    return this._modelCls.schema.models.get(this._name)
  }

  get model () {
    return this._model
  }

  get schema () {
    return this._schema
  }

  get fields () {
    return this.model.fields
  }

  get manager () {
    return this.model.manager
  }

  get objects () {
    return this.manager
  }

  get fields () {
    return this._fields
  }

  set fields (val) {
    this._fields = val
    return val
  }

  get pk () {
    return this._values.get(this.primaryKey)
  }

  get primaryKey () {
    return this._primaryKey || 'walaxID'
  }

  initFields (values = false, deleted = false) {
    if (this._init) {
      this.d('re-init, exiting')
      return
    }

    this.d('HELLO', this.primaryKey, this.fields)

    if (!this.primaryKey) this.fields[this.primaryKey] = {}

    this.d('initializing fields', this._fields)

    let s = this._schema,
      n = this._name
    if (!s || !n) {
      this.d('not ready to initialize this object yet')
      return
    }
    this.d('RIGHT HERE', this, 'schema', s, 'name', n)
    if (Object.keys(s.models.get(n)._fields).length)
      Object.keys(s.models.get(n)._fields).forEach(fn => {
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
  _setField (field, val) {
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
