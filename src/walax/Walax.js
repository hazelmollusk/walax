import 'regenerator-runtime/runtime' // i guess
import { Logger, consoleLog } from './control/Logger'
import WalaxEntity from './util/WalaxEntity'
import Control from './control/Control'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'
import Test from './control/Test'

const { observable } = require('mobx')

// need our own debug/asserts bc log plugin
// might not be there during instantiation of the
// walax object

// todo console logging themes (for applications)
const DEBUG = true
const WLXBG1 =
  'background-color: green; padding: 2px; \
          color: white; border: 3px solid #bbb; \
          border-radius: 6px; font-variant: small-caps; \
          font-weight: bold; font-family: serif; \
          font-size: 16px; border-right: none; \
          border-top-right-radius: 0px; \
          border-bottom-right-radius: 0px; \
          '
const WLX1 =
  'color:green; background-color: lightgrey; padding: 2px; \
        border: 3px solid #bababa; border-radius: 8px; \
        font-weight: bold; font-family: serif; \
        font-variant: small-caps; font-size: 16px; \
        border-left: none; \
        border-top-left-radius: 0px; \
        border-bottom-left-radius: 0px; \
        '
const d = DEBUG
  ? (t, ...m) => console.log(`%c  walax  %c ${t} `, WLXBG1, WLX1, ...m)
  : () => undefined
const WLXBG2 =
  'background-color: red; padding: 2px; \
          color: white; border: 3px solid #bbb; \
          border-radius: 6px; font-variant: small-caps; \
          font-weight: bold; font-family: serif; \
          font-size: 16px; border-right: none; \
          border-top-right-radius: 0px; \
          border-bottom-right-radius: 0px; \
          '
const WLX2 =
  'color:green; background-color: lightgrey; padding: 2px; \
        border: 3px solid #bababa; border-radius: 8px; \
        font-weight: bold; font-family: serif; \
        font-variant: small-caps; font-size: 16px; \
        border-left: none; \
        border-top-left-radius: 0px; \
        border-bottom-left-radius: 0px; \
        '
const _d_a = DEBUG
  ? (...m) => console.log(`%c  walax  %c ASSERT FAILED `, WLXBG2, WLX2, ...m)
  : () => undefined

const a = (c, ...m) => {
  if (!c) {
    _d_a(...m)
    throw new TypeError(m[0])
  }
}

export class Walax extends WalaxEntity {
  constructor (...args) {
    super()
    this.augmentObj(this, 'config', new Map())
    this.augmentObj(this, 'plugins', new Map())
    this.augmentObj(this, 'classes', new Map())
  }

  toString () {
    return 'WALAX'
  }

  initialize (...sig) {
    this.signal('iuit', ...sig)
    this.signal('go')
  }
  setup (config, force) {
    if (force) {
      this.config.clear()
      this.plugins.clear()
    }
    if (config) for (let name in config) this._config.set(name, config[name])

    // register plugins
    const plug = {
      log: Logger,
      cache: Cache,
      net: Network,
      obj: Objects,
      auth: Auth,
      view: View,
      test: Test
    }
    d('initializing...')
    for (let name in plug) this.addPlugin(plug[name], name)

    d('plugins', { attempted: plug }, { current: this._plugins })
    // a(this._plugins.size == Object.keys(plug).size, 'plugin count wrong')

    // should have normal logging by now
    this.log.register(consoleLog)
    this.log.info('setup complete')

    // initialize plugins
    d('setup complete')
    super.initialize()
  }

  addPlugin (cmp, key = false, ...args) {
    this._plugins ||= new Map()
    key ||= cmp.name

    d(`registering control ${key}`, cmp)
    a(!this._plugins.has(key), `control ${key} exists`, cmp)
    a(this.checkClass(Control, cmp), `${key} is not BaseControl`, cmp)
    a(this.isValidProp(key), `invalid control key ${key}`, cmp)
    d(`validated plugin ${key}`, cmp)

    let newCmp = new cmp(w, ...args)
    this._plugins.set(key, newCmp)
    this.addSignal(newCmp)
    this.augment(this, key, () => this._plugins.get(key))

    return cmp
  }

  isValidProp (name) {
    if (!name) return false
    if (typeof name != 'string') return false
    if (name.search(/[^\w]/) != -1) return false
    return true
  }

  callable (...args) {
    let f = args.length == 2 && args[1] in args[0] ? args[0][args[1]] : args[0]
    return f instanceof Function
  }

  augmentObj (obj, key, prop) {
    obj._walaxAugmentations ||= new Map()
    obj._walaxAugmentations.set(key, prop)
    this.augment(obj, key, () => obj._walaxAugmentations.get(key))
  }

  augment (obj, key, getter, setter = undefined) {
    d('augmenting', { obj }, { key }, { getter }, { setter })
    a(
      obj && key && getter,
      'augment called improperly',
      { obj },
      { key },
      { getter }
    )
    a(this.isValidProp(key), `invalid key: ${key}`)
    a(!Object.keys(obj).includes(key), `key exists: ${key}`)
    a(
      typeof getter == 'function',
      'getter must be a function',
      { obj },
      { key },
      { getter }
    )
    let desc = {
      enumerable: true,
      configurable: false, // really should be false FIXME
      get: getter
    }
    if (setter) desc.set = setter
    Object.defineProperty(obj, key, desc)
    a(Object.getOwnPropertyNames(obj).includes(key), 'augmentation failed')
    d('augmented', { obj }, { key }, { desc })
  }

  checkClass (req, cls) {
    if (!req || !cls) return false // should prob log something heres
    if (req instanceof cls) return true
    if (!cls || !req) return false
    if (cls == req) return true
    return this.checkClass(req, cls.__proto__)
  }

  findProperty (cls, prop) {}
}

// export const w = new Walax()
export const w = observable.box(new Walax()).get()

// export default w
export default w
