import { observable, computed } from 'mobx'
import { WalaxSchema } from '../model/WalaxSchema'
import { DjangoSchema } from '../model/DjangoSchema'
import w from '../Walax'

export const WalaxObjects = {
  schema: observable.map(),
  models: observable.map(),

  loadSchema (schema, name) {
    // pre-built WalaxSchema
    // ,todo checking, implement
  },

  checkName (name) {
    if (this.schema.has(name)) return false
    if (!w.isValidProp(name)) return false
    return true
  },

  loadUri (uri, name = false) {
    
    if (name && !this.checkName(name))
      throw new ReferenceError(`cannot assign name ${name} to URI ${uri}`)
    
    this.schema.set(name || uri, new DjangoSchema(uri))
  },

  schema (name) {
    return this.schema.get(name)
  },

  get models () {
    var mods = new Map()
    this.schema.forEach((v, k) => {})
  }
}

export default WalaxObjects
