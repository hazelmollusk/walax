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
    this.apiUrl = key || null
    if (this.apiUrl) { this.loadSchema() }
  }

  loadSchema () {
    w.get(this.apiUrl)
  }
}

export default ObjectControl
