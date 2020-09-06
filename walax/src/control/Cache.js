import { observable } from 'mobx'
import Logger from './Logger'

let f = 'w.cache'
let d = (...a) => Logger.debug(f, ...a)
let e = (...a) => Logger.error(f, ...a)
let a = (b, m, d) => Logger.assert(b, `!![ ${f} ]!! ${m}`, d)

class WalaxCache {
  _name = false
  _storage = false
  constructor (name = 'root') {
    d(`CACHE NEW: ${name}`)
    this._name = name
    this._storage = new Map()
  }
  cache (key) {
    if (!this._storage.has(key)) this._storage.set(key, new WalaxCache(key))
    return this._storage.get(key)
  }
  find (key, func, ...args) {
    d(`CACHE: ${this._name}.${key}`, func, ...args)
    if (args.length) return this.cache(args.shift()).find(key, func, ...args)
    if (!this._storage.has(key)) {
      d(`CACHE MISS: ${this._name}.${key} (${typeof func})`)
      if (typeof func == 'function') this._storage.set(key, func(key))
      else if (func === undefined) this._storage.delete(key)
      else this._storage.set(key, func)
      d('CACHE STORE: ', this._storage.get(key))
    } else {
      d(`CACHE HIT: ${this._name}.${key}`)
    }
    return this._storage.get(key)
  }
  remove (key, ...args) {
    let c = this
    while (args.length) c = c.cache(args.pop())
    d(`CACHE DEL: ${this._name}.${key}`)
    return c._storage.delete(key)
  }
  store (key, func, ...args) {
    d(`CACHE PUT: ${this._name}.${key}`)
    this.remove(key, ...args)
    return this.find(key, func, ...args)
  }
}

const Cache = new WalaxCache()

export default Cache
