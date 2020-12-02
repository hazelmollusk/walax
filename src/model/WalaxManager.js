import { WalaxEntity } from '../util/WalaxUtil'
import w from '../Walax'
var m = require('mithril')
var { observable } = require('mobx')

class WalaxManager extends WalaxEntity {
  _model = false

  constructor (w, model) {
    super(w)
    this._model = model
  }

  all () {}
  filter (...args) {}
  get (pk) {}
}

export default WalaxManager
