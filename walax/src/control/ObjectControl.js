import Control from './Control'
import { observable, computed } from 'mobx'
import { WalaxSchema } from '../model/WalaxSchema'
import { OpenApiSchema } from '../model/OpenApiSchema'

class ObjectControl extends Control {
  schema = observable.map()
  models = observable.map()

  /**
   *Creates an instance of ObjectControl.
   * @param {boolean} [key=false]
   * @memberof ObjectControl
   *
   * ObjectControl(key) uses the value passed
   * as a URI for the base schema to load.
   */
  constructor () {
    super()
  }

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
    
    this.schema.set(name, new OpenApiSchema(uri))
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
