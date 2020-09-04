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
    console.log('FIND', func, args)
    if (args.length) {
      let testVal = args.pop()
      if (testVal !== undefined) args.push(testVal)
      let key = args.shift()
      if (args.length) return this.cache(key).find(func, ...args)
      if (!this._storage.has(key)) {
        if (typeof func == 'function') this._storage.set(key, func(key))
        else if (func === undefined) this._storage.delete(key)
        else this._storage.set(key, func)
        console.log('STOR', this._storage, key, func)
      }
      return this._storage.get(key)
    }
    return undefined
  }
  remove (...args) {
    let c = this
    while (args.length > 1) c = c.cache(args.pop())
    c._storage.delete(args.pop())
    return true
  }
  store (func, ...args) {
    this.remove(...args)
    return this.find(func, ...args)
  }
}

const Cache = new WalaxCache()

export default Cache
