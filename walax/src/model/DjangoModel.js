import WalaxModel from './WalaxModel'
import w from '../Walax'

export default class DjangoModel extends WalaxModel {
  _name = ''
  _fields = {}
  _values = new Map()
  _dirty = new Set()
  _primaryKey = 'id'
  _new = true
  _schemaUri = false
  _modelUri = false
  _uri = false

  constructor (name, fields) {
    super()
  }

  save () {
    if (this._new) {
      let saveFields = Object.fromEntries(this._values)
      w.net.post(this._modelUri, {}, saveFields, {}).then(x => console.log(x))
    } else {
    }
  }

  delete () {}
}
