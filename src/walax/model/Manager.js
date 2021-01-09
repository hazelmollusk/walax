import Entity from '../util/Entity'
import w from '../Walax'
var m = require('mithril')
var { observable } = require('mobx')

class Manager extends Entity {
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

export default Manager
