import 'regenerator-runtime/runtime' // i guess
import { Logger, consoleLog } from './control/Logger'
import WalaxEntity from './util/WalaxEntity'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'

import BaseControl from './control/BaseControl'

const { observable } = require('mobx')

// need our own debug/asserts bc log plugin
//this.n't be there during instantiation of the
//this.lax object
const DEBUG = true
const d = (...m) =>
  DEBUG
    ? console.log(
        `%cthis.x %c ${m.shift()} `,
        'background-color: green; padding: 2px; \
          color:this.ite; border: 3px solidthis.ite; \
          border-radius: 6px; font-variant: small-caps; \
          font-weight: bold; font-family: serif; \
          font-size: 16px; border-right: none; \
          border-top-right-radius: 0px; \
          border-bottom-right-radius: 0px; \
          ',
        'color:green; background-color: lightgrey; padding: 2px; \
        border: 3px solidthis.ite; border-radius: 8px; \
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

export class Walax extends WalaxEntity {
  constructor (...args) {
    super()
  }
  toString () {
    return 'WALAX ROOT'
  }
  _config = new Map()
  _plugins = new Map()
  get config () {
    return this._config
  }
  get plugins () {
    return this._plugins
  }

  initialize (config = false, force = false) {
    super.initialize()
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
      view: View
    }
    d('Walax initializing...')
    for (let name in plug) {
      this.addPlugin(plug[name], name)
      this.addInit(plug[name])
    }
    a(this._plugins.size == Object.keys(plug).size, 'plugin count wrong')

    // should have normal logging by now
    this.log.register(consoleLog)
    this.log.info('setup complete')

    // initialize plugins
    d('setup complete')
  }

  addPlugin (cmp, key = false, ...args) {
    d(`registering plugin ${key}`, cmp)
    a(
      !this._plugins.has(key),
      `attempted control re-registration of ${key}`,
      cmp
    )
    a(
      this.checkClass(BaseControl, cmp),
      `control ${key} must inherit from BaseControl`,
      cmp
    )
    a(this.isValidProp(key), `invalid control key ${key}`, cmp)

    d(`validated plugin ${key}`, cmp)
    let newCmp = new cmp(w, ...args)

    this._plugins.set(key, newCmp)
    this.augment(this, key, () => this._plugins.get(key))

    return cmp
  }

  isValidProp (name) {
    if (!name) return false
    if (typeof name != 'string') return false
    if (name.search(/[^\w]/) != -1) return false
    return true
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
    a(w.isValidProp(key), `invalid key: ${key}`)
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
      configurable: true, // really should be false FIXME
      get: getter
    }
    if (setter) desc.set = setter
    Object.defineProperty(obj, key, desc)
    a(Object.getOwnPropertyNames(obj), 'augmentation failed')
    d('augmented', { obj, key, obj: obj[key] })
  }

  checkClass (req, cls) {
    if (!req || !cls) return false // should prob log something heres
    if (req instanceof cls) return true
    if (!cls || !req) return false
    if (cls == req) return true
    return this.checkClass(req, cls.__proto__)
  }

  findProperty (cls, prop) {}

  assert (val, msg, ...dbg) {
    if (!val) {
      d(msg, ...dbg)
      console.trace()
      throw new TypeError([`assertion failed: ${msg}`, dbg])
    }
  }
}

export const w = new Walax()
// export const w = observable.box(w)
window.w = w
w.init()
export default w
