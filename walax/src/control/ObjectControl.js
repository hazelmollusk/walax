import Control from './Control'
import ModelBase from '../model/ModelBase'
import w from '../Walax'

class ObjectControl extends Control {
  /**
   *Creates an instance of ObjectControl.
   * @param {boolean} [key=false]
   * @memberof ObjectControl
   *
   * ObjectControl(key) uses the value passed
   * as a URI for the base schema to load.
   */
  constructor (key = false) {
    super()
    this._init()
  }

  _init () {
    this.schema = null
    this._schemaUri = null
    this._ops = null
    this._models = null
    this._modelNames = null
    this._managers = null
    this._status = null
  }

  get schemaUri () { return this._schemaUri }
  set schemaUri (url) {
    this._init()
    this._schemaUri = url
    this._loadSchema()
  }

  _loadSchema () {
    this._status = false
    w.log.info(`loading model schema: ${this.schemaUri}`)
    return w.net.get(this.schemaUri).then(data => {
      this.schema = data
      this.status = true
      console.log(data)
    })
  }

  get modelNames () {
    if (!this._modelNames) {
      let mappings = new Map()
      let names = new Set(
        Object.values(this.ops)
          .map(v => v?.op[1]))
      names.forEach(x => {
        // check for plurals
        ['s','es'].forEach(y => {
          if (names.has(x + y)) {
            names.delete(x + y)
            mappings.set(x + y, x)
          }
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

  get models () {
    if (!this._models && this.modelNames && this.ops) {
      this._models = {}      
      this._modelNames.forEach(model => {
        class WalaxProxyModel extends ModelBase {
          static _wlx_model = model
        }

        this._models[model] = WalaxProxyModel
        
      })
      w.log.info('regenerating model classes', this._models)
    }
    return this._models
  }

  get ops () {
    if (!this._ops && this.schema?.paths) {
      this._ops = {}
      Object.entries(this.schema.paths).map(p => 
        Object.entries(methods).map(m => {
          let opId = m[1].operationId
          console.log(opId)
          this._ops[opId] = {
            path: p[0],
            method: m[0],
            detail: m[1],
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

export default ObjectControl
