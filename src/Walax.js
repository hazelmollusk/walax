import ControlBase from './control/BaseControl'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'

import Logger from './control/Logger'
import KeyedSingleton from './util/KeyedSingleton'

const { observable } = require('mobx')
const { d, a, e, i } = Logger.daei('walax')

export class Walax extends KeyedSingleton {
  constructor (...args) {
    this.all = new Set()
    this.keys = new Map()
    this.init()
  }

  init (force = false) {
    //todo if force clear out maps, etc
    if (!this._init) {
      this.register(Logger, 'log')
      this.register(Cache, 'cache')
      this.register(Network, 'net')
      this.register(Objects, 'obj')
      this.register(Auth, 'auth')
      this.register(View, 'view')

      this.log.register(consoleLog)

      this._init = true
    }
  }

  get dbg () {
    return this.keys.has('log') ? this.log.debug : d
  }

  static instance (name, ...args) {
    if (!name) name = DEFAULT_KEY

    if (!Walax._instances.has(name)) Walax._instances.set(new Walax(...args))

    return Walax._instances.get(name)
  }

  static configure (data) {
    Object.keys(data).map((v, k) =>
      Walax.checkName(k) ? Walax.globalConfig.set(k, v) : false
    )
  }

  static isValidProp (name) {
    if (!name) return false
    if (typeof name != 'string') return false
    if (name.search(/[^\w]/) != -1) return false
    return true
  }

  static checkName (key) {
    if (!this.isValidProp(key))
      throw new TypeError(`invalid component name ${key}`)
    if (this.keys.has(key))
      throw new TypeError(`component ${key} is already registered`)
    return true
  }

  static augment (obj, key, desc = undefined, enumerate = true) {
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
  }

  static checkClass (req, cls) {
    if (!cls || !req) return false
    if (cls == req) return true
    return this.checkClass(req, cls.__proto__)
  }

  static findProperty (cls, prop) {}

  assert (val, msg, dbginfo) {
    if (!val) {
      this.log.error(msg, dbginfo)
      throw new TypeError(msg)
      // crash and reload?  what now?
    }
  }

  register (cmp, key = false, ...args) {
    this.assert(!this.all.has(cmp), `attempted re-registration of ${key}`)
    this.assert(!Walax.checkClass(ControlBase, cmp))

    newComp = cmp(this, ...args)

    this.all.add(newCmp)
    if (this.checkName(key)) {
      this.augment(this, key, { get: () => this.keys.get(key) })
      this.keys.set(key, newCmp)
    }

    return cmp
  }

  signal (sig) {
    //for each controller, if ctrl.signal is callable, call it with arg sig TODO
  }
}

/* shortcut functions */
export const getWalax = (...args) => observable(new Walax(...args))

// TODO is it our place to do this here?  is this a switch?
export const w = Walax()
window.w = w

export default Walax
