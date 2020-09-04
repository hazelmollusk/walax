import { observable } from 'mobx'
import w from '../Walax'

class WalaxCache {
  _storage = false
  constructor () {
    this._storage = new Map()
  }
  cache (key) {
    if (!this._storage.has(key)) this._storage.set(key, new WalaxCache())
    return this._storage.get(key)
  }
  find (func, ...args) {
    if (args.length) {
      let key = args.pop()
      w.log.debug('args.length')
      w.log.debug(key, args)
      if (args.length) return this.cache(key).find(func, ...args)
      w.log.debug('is value')
      if (!this._storage.has(key))
        if (typeof func == 'function') this._storage.set(key, func(key))
        else if (func === undefined) this._storage.delete(key)
        else this._storage.set(key, func)
      return this._storage.get(key)
    }
    return undefined
  }
  remove (...args) {
    let c = this
    while (args.length > 1) c = c.cache(args.pop())
    c.delete(args.pop())
    return true
  }
  store (func, ...args) {
    return this.remove(...args) && this.find(func, ...args)
  }
}

const Cache = new WalaxCache()

export default Cache
