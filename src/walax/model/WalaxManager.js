import WalaxEntity from '../util/WalaxEntity'
import w from '../Walax'
var m = require('mithril')
var { observable } = require('mobx')

class WalaxManager extends WalaxEntity {
  _model = false

  static _managers = new Map()
  static getForModel (model) {
    if (!this._managers.has(model)) {
      let mgr = new this(model)
      this._managers.set(model, mgr)
    }
    return this._managers.get(model)
  }

  constructor () {
    super()
  }

  all () {}
  filter (...args) {}
  one (arg) {}
}

export default WalaxManager
