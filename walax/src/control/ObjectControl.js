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
  }

  get schemaUri () { return this._schemaUri }
  set schemaUri (url) {
    this._init()
    this._schemaUri = url
    this.loadSchema()
  }

  loadSchema () {
    w.net.get(this.schemaUri).then(data => {
      this.schema = data
      console.log(this.models)
    })
  }

  get modelNames () {
    if (!this._modelNames) {
      this._modelNames = new Set()
      Object.values(this.ops)
        .map(v => { this._modelNames.add(v) })

      console.log(this._modelNames)
    }
    return this._modelNames
  }

  get models () {
    if (!this._models) {
      this._models = {}
      w.log.debug('regenerating model classes')
      this.modelNames.forEach(model => {
        class WalaxProxyModel extends ModelBase {}
        this._models[model] = WalaxProxyModel
      })
      console.log(this._models)
    }
    return this._models
  }

  get ops () {
    if (!this._ops) {
      this._ops = {}
      Object.entries(this.schema.paths).map(p => {
        let path = p[0], methods = p[1]
        Object.entries(methods).map(m => {
          let opId = m[1].operationId
          this._ops[opId] = {
            path: p[0],
            method: m[0],
            detail: m[1],
            op: opId
                  .match(/[A-Z]?[a-z]+/g)
                  .map(s => s.toLowerCase())
          }
        })
      })
    }
    return this._ops
  }
}

export default ObjectControl
