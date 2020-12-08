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

const WalaxMain = {
  _plugins: new Map(),
  _config: new Map(),
  _init: 0,

  setup: (force = false) => {
    //todo if force clear out maps, etc
    if (force) {
      WalaxMain._init = false
      WalaxMain._config.clear()
      WalaxMain._plugins.clear()
    }
    if (!WalaxMain._init) {
      d('WalaxMain initializing')
      WalaxMain.register(Logger, 'log')
      WalaxMain.register(Cache, 'cache')
      WalaxMain.register(Network, 'net')
      WalaxMain.register(Objects, 'obj')
      WalaxMain.register(Auth, 'auth')
      WalaxMain.register(View, 'view')
      d('plugins registered')

      WalaxMain.log.register(consoleLog)
      WalaxMain.log.info('setup complete')
      WalaxMain._init = 1
      d('setup complete')
    }
  },

  init: data => {
    WalaxMain.configure(data)
    WalaxMain._plugins.forEach((v, k) => (v.init ? v.init() : undefined))
  },

  configure: data => {
    data ||= { dummy: 0 }
    Object.keys(data).map((v, k) =>
      WalaxMain.isValidProp(k) ? WalaxMain._config.set(k, v) : false
    )
  },

  isValidProp: name => {
    if (!name) return false
    if (typeof name != 'string') return false
    if (name.search(/[^\w]/) != -1) return false
    return true
  },

  augment: (obj, key, getter, setter = undefined) => {
    d('augmenting', obj, key, getter, setter)
    if (!obj || !key || !getter)
      throw new TypeError('augment called improperly')
    if (!WalaxMain.isValidProp(key)) throw new TypeError(`invalid key: ${key}`)
    if (Object.keys(obj).includes(key))
      throw new TypeError(`key exists: ${key}`)
    let desc = {
      //   enumerable: true,
      //   configurable: false,
      get: () => getter
    }
    if (setter) desc.setter = setter
    Object.defineProperty(obj, key, desc)
    WalaxMain.assert(Object.getOwnPropertyNames(obj), 'augmentation failed')
    d('augmented', obj, obj[key])
  },

  checkClass: (req, cls) => {
    if (!req || !cls) return false // should prob log something heres
    if (req instanceof cls) return true
    if (!cls || !req) return false
    if (cls == req) return true
    return WalaxMain.checkClass(req, cls.__proto__)
  },

  findProperty: (cls, prop) => {},

  assert: (val, msg, dbginfo) => {
    if (!val) {
      d(msg, dbginfo)
      console.trace()
      throw new TypeError([`assertion failed: ${msg}`, val, dbginfo])
    }
  },

  register: (cmp, key = false, ...args) => {
    d(`registering plugin ${key}`, cmp)
    WalaxMain.assert(
      !WalaxMain._plugins.has(key),
      `attempted control re-registration of ${key}`,
      cmp
    )
    WalaxMain.assert(
      WalaxMain.checkClass(BaseControl, cmp),
      `control ${key} must inherit from BaseControl`,
      cmp
    )
    WalaxMain.assert(
      WalaxMain.isValidProp(key),
      `invalid control key ${key}`,
      cmp
    )

    d(`validated plugin ${key}`, cmp)
    let newCmp = new cmp(WalaxMain, ...args)

    WalaxMain._plugins.set(key, newCmp)
    WalaxMain.augment(WalaxMain, key, () => WalaxMain._plugins.get(key))

    return cmp
  },

  signal: sig => {
    //for each controller, if ctrl.signal is callable, call it with arg sig TODO
  }
}

export const WalaxMainBox = observable.box(WalaxMain)
// export const Walax = WalaxMainBox.get()
export const Walax = WalaxMain
export const w = Walax
window.w = w
w.setup()
export default w
