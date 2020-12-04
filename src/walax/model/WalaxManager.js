import WalaxEntity from '../util/WalaxEntity'
import w from '../Walax'
var m = require('mithril')
var { observable } = require('mobx')

class WalaxManager extends WalaxEntity{
  _model = false

  constructor (model) {
    this._model = model
  }

  all () {}
  filter (...args) {}
  get (pk) {}
}

export default WalaxManager
