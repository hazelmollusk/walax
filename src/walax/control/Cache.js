import w from '../Walax'
import Control from './Control'

const f = 'Cache'

export default class Cache extends Control {
  _storage = false
  constructor () {
    super()
    this._storage = new Map()
  }
  toString () {
    return 'Cache'
  }
  getPropName () {
    return 'cache'
  }
  get (key, func = undefined) {
    if (this._storage.has(key)) {
      // this.d('cache hit', key)
      return this._storage.get(key)
    } else if (w.callable(func)) {
      // this.d('cache miss, creating', key)
      this._storage.set(key, func(key))
    } else if (func === undefined) {
      // this.d('cache miss')
      return undefined
    } else this._storage.set(key, func)
    return this._storage.get(key)
  }
}
