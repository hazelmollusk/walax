import Control from './Control'
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
  }

  get schemaUri () { return this._schemaUri }
  set schemaUri (url) {
    this._init()
    this._schemaUri = url
    this.loadSchema(this._schemaUri)
  }

  loadSchema (uri) {
    w.net.get(uri).then(data => {
      this.schema = data
      console.log(data)
    })
  }
}

export default ObjectControl
