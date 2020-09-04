import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'

import { Logger, consoleLog } from './control/Logger'

const { observable } = require('mobx')

export const Walax = observable({
  all: new Set(),
  keys: new Map(),
  _init: false,

  isValidProp (name) {
    if (!name) return false
    if (typeof name != 'string') return false
    if (name.search(/[^\w]/) != -1) return false
    return true
  },

  checkName (key) {
    if (!this.isValidProp(key))
      throw new TypeError(`invalid component name ${key}`)
    if (this.keys.has(key))
      throw new TypeError(`component ${key} is already registered`)
    return true
  },

  augment (obj, key, desc = undefined, enumerate = true) {
    if (!obj || !key || !desc) throw new TypeError('augment called improperly')
    if (!this.isValidProp(key)) throw new TypeError(`invalid key: ${key}`)
    if (Object.keys(obj).includes(key))
      throw new TypeError(`key exists: ${key}`)

    if (!Object.keys(desc).includes('enumerable')) desc.enumerable = enumerate
    if (!Object.keys(desc).includes('configurable')) desc.configurable = false
    if (
      !Object.keys(desc).includes('writable') &&
      !Object.keys(desc).includes('get')
    ) {
      desc.writable = false
    }
    Object.defineProperty(obj, key, desc)
  },

  assert (val, msg, dbginfo) {
    if (!val) {
      this.log?.error(msg, dbginfo)
      throw new TypeError(msg)
      // crash and reload?  what now?
    }
  },

  register (cmp, key = false, ...args) {
    this.assert(!this.all.has(cmp), `attempted re-registration of ${key}`)

    this.all.add(cmp)

    if (this.checkName(key)) {
      this.augment(this, key, { get: () => this.keys.get(key) })
      this.keys.set(key, cmp)
    }

    return cmp
  },

  checkClass (req, cls) {
    if (!cls) return false
    if (cls == req) return true
    return this.checkClass(req, cls.__proto__)
  },

  findProperty (cls, prop) {},

  signal (sig) {
    //for each controller, if ctrl.signal is callable, call it with arg sig TODO
  },

  init (force = false) {
    //todo if force clear out maps, etc
    if (!this._init) {
      w.register(Logger, 'log')
      w.register(Cache, 'cache')
      w.register(Network, 'net')
      w.register(Objects, 'obj')
      w.register(Auth, 'auth')
      w.register(View, 'view')

      w.log.register(consoleLog)

      this._init = true
    }
  }
})

export const w = Walax
window.w = w

export default w
