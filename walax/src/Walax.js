import Objects from './control/Objects'
import Network from './control/Network'
import Realm from './control/Realm'
import Auth from './control/Auth'
import { Logger, consoleLog } from './control/Logger'

const { observable } = require('mobx')

export const Walax = observable({
  all: new Set(),
  keys: new Map(),

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

    desc ||= {}

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

  register (cmp, key = false, ...args) {
    if (this.all.has(cmp))
      throw new TypeError(`attempted re-registration of ${key}`)

    this.all.add(cmp)

    if (this.checkName(key)) {
      this.augment(this, key, { get: () => this.keys.get(key) })
      this.keys.set(key, cmp)
    }

    return cmp
  },

  init () {
    w.register(Logger, 'log')
    w.register(Network, 'net')
    w.register(Objects, 'obj')
    w.register(Realm, 'realm')
    w.register(Auth, 'auth')
    w.register(Cache, 'cache')

    w.log.register(consoleLog)

    w.realm.init()
  }
})

export const w = Walax
window.w = w


export default w
