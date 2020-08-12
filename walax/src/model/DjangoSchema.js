import ModelBase from './ModelBase'
import { observable } from 'mobx'
import { WalaxSchema } from './WalaxSchema'
const m = require('mithril')

export class OpenApiSchema extends WalaxSchema {
  _uri = false
  _ops = observable.map()
  _models = observable.map()

  constructor(uri = false, models = false) {
    super()
    if (uri) this.load(uri, models)
  }

  load(uri, models = false) {
    if (!this.checkUri(uri)) 
      throw new URIError(`invalid schema URI: ${uri}`)
    if (models || !this.checkModels(models)) 
      throw new TypeError(`invalid models: ${uri}`)
    w.net.get(uri).then(data => {
      if (!this.checkSchema(data))
        throw new TypeError(`invalid schema response: ${uri}`)
      this.schema = data 
      this.models.clear()

      // work
      this.title = data.info.title || 'unnamed'
      this.version = data.info.version || -1
      this.description = data.info.description || ''
      Object.entries(data.paths)
    }
  }
  
  get uri() { return this._uri }
  set uri(uri) { this.load(uri) }
  checkUri(uri) {

  }

  get modelNames() {
    if (!this._modelNames) {
      let mappings = new Map()
      console.log(this.ops)
      let names = new Set(Object
        .values(this.ops)
        .map(v => v?.op[1]))
      names.forEach(x => {
        // check for plurals
        ['s', 'es'].forEach(y => {
          names.delete(x + y) && mappings.set(x + y, x)
        })
      })
      w.log.info('parsed model names', names, mappings)
      this._modelMap = mappings
      this._modelNames = names
    }
    return this._modelNames
  }

  get modelMap() {
    return this.modelNames && this._modelMap
  }

  get models() {
    if (!this._models && this.modelNames && this.ops) {
      this._models = observable.map()
      this._modelNames.forEach(model => {
        class WalaxProxyModel extends ModelBase {
          static _wlx_model = model
        }
        // todo add properties 
        this._models[model] = WalaxProxyModel

      })
      w.log.info('regenerated model classes', this._models)
    }
    return this._models
  }

  get ops() {
    if (!this._ops && this.schema?.paths) {
      this._ops = observable.map()
      Object.entries(this.schema.paths).map(paths => 
            Object.entries(paths[1]).map(path => {
        let opId = path[1].operationId
        
        // this is how we store model definitions internally
        this._ops[opId] = {
          path: paths[0],
          method: path[0],
          detail: path[1],
          op: opId
            .match(/[A-Z]?[a-z]+/g)
            .map(s => s.toLowerCase())
        }
      }))
      w.log.info('built operations map', this._ops)
    }
    return this._ops
  }
}
