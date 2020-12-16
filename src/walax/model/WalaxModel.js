import WalaxManager from './WalaxManager'
import WalaxEntity from '../util/WalaxEntity'
import w from '../Walax'

export default class WalaxModel extends WalaxEntity {
  static _fields = {}
  constructor (data = false) {
    super()
  }

  initModel (data) {
    this.a(false, 'initModel not implemented')
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

  initFields (values = false, deleted = false) {
    if (this._init) {
      this.d('re-init, exiting')
      return
    }

    this.d('HELLO', this.primaryKey, this.fields)

    //if (!this.primaryKey) this.fields[this.primaryKey] = {}

    //this.d('initializing fields', this._fields)

    if (!s || !n) {
      this.d('not ready to initialize this object yet')
      return
    }
    this.d('RIGHT HERE', this, 'schema', s, 'name', n)

    this.d('finished initializing', this)
    this._init = true
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
