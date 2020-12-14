import WalaxManager from './WalaxManager'
import WalaxEntity from '../util/WalaxEntity'
import w from '../Walax'

export default class WalaxModel extends WalaxEntity {
  static _primaryKey = false

  constructor (data = false) {
    super()
    //this.initFields(data)
  }

  get manager () {
    return this.model.manager
  }

  get objects () {
    return this.manager
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

    //if (!this.primaryKey) this.fields[this.primaryKey] = {}

    //this.d('initializing fields', this._fields)

    let s = this.schema,
      n = this.name
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

  getUrl () {
    throw new TypeError('model class must implement getUri()')
  }

  save () {
    throw new TypeError('model class must implement save()')
  }

  delete () {
    throw new TypeError('model class must implement delete()')
  }
}
