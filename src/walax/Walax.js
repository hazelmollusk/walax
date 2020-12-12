import 'regenerator-runtime/runtime' // i guess
import { Logger, consoleLog } from './control/Logger'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'

import BaseControl from './control/BaseControl'

const { observable } = require('mobx')

const DEBUG = true
const d = (...m) =>
  DEBUG
    ? console.log(
        `%c wlx %c ${m.shift()} `,
        'background-color: green; padding: 2px; \
          color: white; border: 3px solid white; \
          border-radius: 6px; font-variant: small-caps; \
          font-weight: bold; font-family: serif; \
          font-size: 16px; border-right: none; \
          border-top-right-radius: 0px; \
          border-bottom-right-radius: 0px; \
          ',
        'color:green; background-color: lightgrey; padding: 2px; \
        border: 3px solid white; border-radius: 8px; \
        font-weight: bold; font-family: serif; \
        font-variant: small-caps; font-size: 16px; \
        border-left: none; \
        border-top-left-radius: 0px; \
        border-bottom-left-radius: 0px; \
        ',
        ...m
      )
    : null

const a = (c, ...m) => w.assert(...m)

const w = {
  _plugins: new Map(),
  _config: new Map(),
  _init: 0,

  setup: (force = false) => {
    //todo if force clear out maps, etc
    if (force) {
      w._init = false
      w._config.clear()
      w._plugins.clear()
    }
    if (!w._init) {
      d('WalaxMain initializing')
      w.register(Logger, 'log')
      w.register(Cache, 'cache')
      w.register(Network, 'net')
      w.register(Objects, 'obj')
      w.register(Auth, 'auth')
      w.register(View, 'view')
      d('plugins registered')

      w.log.register(consoleLog)
      w.log.info('setup complete')
      w.init()
      w._init = 1
      d('setup complete')
    }
  },

  init: data => {
    w.configure(data)
    w._plugins.forEach((v, k) => (v.init ? v.init() : undefined))
  },

  configure: data => {
    data ||= { dummy: 0 }
    Object.keys(data).map((v, k) =>
      w.isValidProp(k) ? w._config.set(k, v) : false
    )
  },

  isValidProp: name => {
    if (!name) return false
    if (typeof name != 'string') return false
    if (name.search(/[^\w]/) != -1) return false
    return true
  },

  augment: (obj, key, getter, setter = undefined) => {
    d('augmenting', name, obj, key, getter, setter)
    w.assert(
      obj && key && getter,
      'augment called improperly',
      obj,
      key,
      getter
    )
    a(w.isValidProp(key), `invalid key: ${key}`)
    a(!Object.keys(obj).includes(key), `key exists: ${key}`)
    w.assert(typeof getter == 'function', 'getter must be a function', getter)
    let desc = {
      enumerable: true,
      configurable: true,
      get: getter
    }
    if (setter) desc.set = setter
    Object.defineProperty(obj, key, desc)
    w.assert(Object.getOwnPropertyNames(obj), 'augmentation failed')
    d('augmented', obj, obj[key])
  },

  checkClass: (req, cls) => {
    if (!req || !cls) return false // should prob log something heres
    if (req instanceof cls) return true
    if (!cls || !req) return false
    if (cls == req) return true
    return w.checkClass(req, cls.__proto__)
  },

  findProperty: (cls, prop) => {},

  assert: (val, msg, ...dbg) => {
    if (!val) {
      d(msg, ...dbg)
      console.trace()
      throw new TypeError([`assertion failed: ${msg}`, dbg])
    }
  },

  register: (cmp, key = false, ...args) => {
    d(`registering plugin ${key}`, cmp)
    w.assert(
      !w._plugins.has(key),
      `attempted control re-registration of ${key}`,
      cmp
    )
    w.assert(
      w.checkClass(BaseControl, cmp),
      `control ${key} must inherit from BaseControl`,
      cmp
    )
    w.assert(w.isValidProp(key), `invalid control key ${key}`, cmp)

    d(`validated plugin ${key}`, cmp)
    let newCmp = new cmp(w, ...args)

    w._plugins.set(key, newCmp)
    w.augment(w, key, () => w._plugins.get(key))

    return cmp
  },

  signal: sig => {
    //for each controller, if ctrl.signal is callable, call it with arg sig TODO
  }
}

export const WalaxMainBox = observable.box(w)
// export const Walax = WalaxMainBox.get()
export const Walax = w
// export const w = Walax
window.w = w
w.setup()
export default w
