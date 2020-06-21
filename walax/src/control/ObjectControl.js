import Control from './Control'

class ObjectControl extends Control {
  constructor (apiUri = false) {
    super()
    this.schema = null
    if (apiUri) { this.loadSchema(apiUri) }
  }

  loadSchema (uri) {

  }
}

export default ObjectControl
