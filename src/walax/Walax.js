import 'regenerator-runtime/runtime' // i guess
import { Logger, consoleLog } from './control/Logger'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'

import BaseControl from './control/BaseControl'

const { observable } = require('mobx')

const Walax = {
  _plugins: observable.map(),
  _init: false,

  setup: (force = false) => {
    //todo if force clear out maps, etc
    if (force) {
      Walax._init = false
      Walax._plugins.clear()
    }
    if (!Walax._init) {
      Walax.register(Logger, 'log')
      Walax.register(Cache, 'cache')
      Walax.register(Network, 'net')
      Walax.register(Objects, 'obj')
      Walax.register(Auth, 'auth')
      Walax.register(View, 'view')

      Walax.log.register(consoleLog)

      Walax._init = true
    }
  },

  configure: data => {
    Object.keys(data).map((v, k) =>
      Walax.checkName(k) ? Walax.globalConfig.set(k, v) : false
    )
  },

  isValidProp: name => {
    if (!name) return false
    if (typeof name != 'string') return false
    if (name.search(/[^\w]/) != -1) return false
    return true
  },

  augment: (obj, key, desc = undefined) => {
    if (!obj || !key || !desc) throw new TypeError('augment called improperly')
    if (!Walax.isValidProp(key)) throw new TypeError(`invalid key: ${key}`)
    if (Object.keys(obj).includes(key))
      throw new TypeError(`key exists: ${key}`)

    if (!Object.keys(desc).includes('enumerable')) desc.enumerable = true
    if (!Object.keys(desc).includes('configurable')) desc.configurable = false
    if (
      !Object.keys(desc).includes('writable') &&
      !Object.keys(desc).includes('get')
    ) {
      desc.writable = false
    }
    Object.defineProperty(obj, key, desc)
  },

  checkClass: (req, cls) => {
    if (!req || !cls) return false // should prob log something heres
    if (req instanceof cls) return true
    if (!cls || !req) return false
    if (cls == req) return true
    return Walax.checkClass(req, cls.__proto__)
  },

  findProperty: (cls, prop) => {},

  assert: (val, msg, dbginfo) => {
    console.log(val, msg, dbginfo)
    if (!val) {
      console.log(msg, dbginfo)
      console.trace()
      // throw new TypeError(msg)
      // crash and reload?  what now?
    }
  },

  register: (cmp, key = false, ...args) => {
    Walax.assert(
      Walax._plugins.has(key),
      `attempted control re-registration of ${key}`,
      { key, cmp }
    )
    Walax.assert(
      !Walax.checkClass(cmp, BaseControl),
      'control must inherit from BaseControl',
      { key, cmp }
    )

    Walax.assert(Walax.isValidProp(key), `invalid control key ${key}`, {
      key,
      cmp
    })

    let newCmp = new cmp(Walax, ...args)

    Walax._plugins.set(key, newCmp)
    Walax.augment(Walax, key, { get: () => Walax.keys.get(key) })

    return cmp
  },

  signal: sig => {
    //for each controller, if ctrl.signal is callable, call it with arg sig TODO
  }
}

export const w = observable(Walax)
w.setup()
window.w = w

export default Walax
