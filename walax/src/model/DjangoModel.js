import WalaxModel from './WalaxModel'
import w from '../Walax'

export default class DjangoModel extends WalaxModel {
  _name = ''
  _fields = {}
  _values = new Map()
  _dirty = new Set()
  _primaryKey = 'url'
  _new = true
  _schemaUri = false
  _modelUri = false
  _uri = false

  constructor (name, fields) {
    super()
  }

  getUri () {
    return this._uri
  }

  save () {
    let saveFields = Object.fromEntries(this._values.entries())
    //delete saveFields[this._primaryKey]
    if (this._new) {
      w.net.post(this._modelUri, {}, saveFields, {}).then(y => {
        console.log('y', y)
        this._new = false
        this._uri = y.url
        this.updateProperties(this, y)
      })
    } else {
      w.net
        .put(this.getUri(), {}, saveFields, {})
        .then(y => this.updateProperties(y))
    }
  }

  delete () {}
}
