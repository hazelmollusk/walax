import 'regenerator-runtime/runtime' // i guess
import { Logger, consoleLog} from './control/Logger'
import ControlBase from './control/BaseControl'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'

import KeyedSingleton from './util/KeyedSingleton'
import BaseControl from './control/BaseControl'

const { observable } = require('mobx')

const Walax = {
  all: observable.set(),
  keys: observable.map(),

  setup: (force = false) => {
    //todo if force clear out maps, etc
    if (!Walax._init) {
      Walax.register(Logger, 'log')
      Walax.register(Cache, 'cache') / Walax.register(Network, 'net')
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

  checkName: key => {
    if (!Walax.isValidProp(key))
      throw new TypeError(`invalid component name ${key}`)
    if (Walax.keys.has(key))
      throw new TypeError(`component ${key} is already registered`)
    return true
  },

  augment: (obj, key, desc = undefined, enumerate = true) => {
    if (!obj || !key || !desc) throw new TypeError('augment called improperly')
    if (!Walax.isValidProp(key)) throw new TypeError(`invalid key: ${key}`)
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

  checkClass: (req, cls) => {
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
    // Walax.assert(Walax.all.has(key), `attempted re-registration of ${key}`)
    // Walax.assert(!Walax.checkClass(BaseControl, cmp))

    let newCmp = new cmp(Walax, ...args)

    Walax.all.add(newCmp)
    if (Walax.checkName(key)) {
      Walax.augment(Walax, key, { get: () => Walax.keys.get(key) })
      Walax.keys.set(key, newCmp)
    }

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
