import w from '../Walax'
var m = require('mithril')
var { observable } = require('mobx')

class WalaxManager {
  _model = false
  _cache = observable.map()

  constructor (model) {
    this._model = model
  }

  get(id) {
    
  }
}

export default WalaxManager
