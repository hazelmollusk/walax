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

var e = 0
e |> 3

export default ObjectControl
