import { observable, computed } from 'mobx'
import { WalaxSchema } from '../model/WalaxSchema'
import { DjangoSchema } from '../model/DjangoSchema'

export const WalaxObject = {
  schema = observable.map(),
  models = observable.map(),

  loadSchema (schema, name) {
    // pre-built WalaxSchema
    // todo checking, implement
  }

  checkName(name) {
    if (!name) return false
    if ((typeof name) != 'string') return false
    if (this.schema.has(name)) return false
    if (name.search('^\w') != -1) return false
    return true
  }

  loadUri (uri, name = false) {
    name ||= uri 
    if (!this.checkName(name)) 
      throw new ReferenceError(`cannot assign name ${name} to URI ${uri}`)
    
    this.schema.set(name, new DjangoSchema(uri))
  }

  schema (name) { return this.schema.get(name) }

  @computed
  get models () {
    var mods = new Map() 
    this.schema.forEach( (v, k) => {

    })
  }
}

export default ObjectControl
