import Control from './Control'

const f = 'Cache'

export default class WalaxCache extends Control {
  _name = false
  _storage = false
  constructor (name = 'root') {
    super()
    this._name = name
    this._storage = new Map()
  }
  toString () {
    return 'Cache'
  }
  cache (key) {
    if (!this._storage.has(key)) this._storage.set(key, new WalaxCache(key))
    return this._storage.get(key)
  }
  find (key, ...args) {
    let cachePath = args
    let func = null
    if (cachePath.length == 1 && typeof cachePath[0] == 'function')
      func = cachePath.shift()
    if (cachePath.length)
      return this.cache(cachePath.shift()).find(key, func, ...cachePath)
    if (!this._storage.has(key)) {
      this.d('miss', `${this._name}.${key} (${typeof func})`)
      if (typeof func == 'function') this._storage.set(key, func(key))
      else if (func === undefined) this._storage.delete(key)
      else this._storage.set(key, func)
      this.d('store', `${this._name}.${key} == ${this._storage.get(key)}`)
    } else {
      this.d('hit', `${this._name}.${key}`)
    }
    return this._storage.get(key)
  }
  remove (key, ...args) {
    let c = this
    while (args.length) c = c.cache(args.pop())
    this.d(`delete: ${this._name}.${key}`)
    return c._storage.delete(key)
  }
  store (key, func, ...args) {
    this.d(`put: ${this._name}.${key}`)
    this.remove(key, ...args)
    return this.find(key, func, ...args)
  }
}
