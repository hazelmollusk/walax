import { observable } from 'mobx'
import w from '../Walax'

class WalaxCache {
  _name = false
  _storage = false
  constructor (name = 'root') {
    w.dbg(`CACHE NEW: ${name}`)
    this._name = name
    this._storage = new Map()
  }
  cache (key) {
    if (!this._storage.has(key)) this._storage.set(key, new WalaxCache(key))
    return this._storage.get(key)
  }
  find (key, func, ...args) {
    w.dbg(`CACHE: ${this._name}.${key}`, func, ...args)
    if (args.length) return this.cache(args.shift()).find(key, func, ...args)
    if (!this._storage.has(key)) {
      w.dbg(`CACHE MISS: ${this._name}.${key} (${typeof func})`)
      if (typeof func == 'function') this._storage.set(key, func(key))
      else if (func === undefined) this._storage.delete(key)
      else this._storage.set(key, func)
      w.dbg('CACHE STORE: ', this._storage.get(key))
    } else {
      w.dbg(`CACHE HIT: ${this._name}.${key}`)
    }
    return this._storage.get(key)
  }
  remove (key, ...args) {
    let c = this
    while (args.length) c = c.cache(args.pop())
    w.dbg(`CACHE DEL: ${this._name}.${key}`)
    return c._storage.delete(key)
  }
  store (key, func, ...args) {
    w.dbg(`CACHE PUT: ${this._name}.${key}`)
    this.remove(key, ...args)
    return this.find(key, func, ...args)
  }
}

const Cache = new WalaxCache()

export default Cache
