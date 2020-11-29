import { observable } from 'mobx'
import Logger from './Logger'

const f = 'Cache'
const { d, a, e, i } = Logger.daei(f)

export default class WalaxCache extends BaseControl  {
  _name = false
  _storage = false
  constructor (name = 'root') {
    d(`new cache bucket: ${name}`)
    this._name = name
    this._storage = new Map()
  }
  cache (key) {
    if (!this._storage.has(key)) this._storage.set(key, new WalaxCache(key))
    return this._storage.get(key)
  }
  find (key, func, ...args) {
    d(`${this._name}.${key}`, func, ...args)
    let cachePath =
      args.length == 1 && args[0].has('.') ? args.shift().split('.') : args
    if (cachePath.length)
      return this.cache(cachePath.shift()).find(key, func, ...cachePath)
    if (!this._storage.has(key)) {
      d('miss', `${this._name}.${key} (${typeof func})`)
      if (typeof func == 'function') this._storage.set(key, func(key))
      else if (func === undefined) this._storage.delete(key)
      else this._storage.set(key, func)
      d('store', `${this._name}.${key} == ${this._storage.get(key)}`)
    } else {
      d('hit', `${this._name}.${key}`)
    }
    return this._storage.get(key)
  }
  remove (key, ...args) {
    let c = this
    while (args.length) c = c.cache(args.pop())
    d(`delete: ${this._name}.${key}`)
    return c._storage.delete(key)
  }
  store (key, func, ...args) {
    d(`put: ${this._name}.${key}`)
    this.remove(key, ...args)
    return this.find(key, func, ...args)
  }
}
