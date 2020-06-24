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
    this.schema = null
    this._apiUrl = null
    this.api = null
  }

  get apiUrl () { return this._apiUrl }
  set apiUrl (url) {
    this._apiUrl = url
    this.loadSchema()
  }

  loadSchema () {
    w.net.get(this.apiUrl)
  }
}

export default ObjectControl
