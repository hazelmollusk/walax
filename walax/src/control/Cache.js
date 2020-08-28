import { observable } from 'mobx'

const Cache = observable({
  _storage: observable.map(),

  store (cache, key, func = undefined) {
    if (typeof cache != 'string')
      throw new TypeError('cache buckets must be strings')
    
    if (!this._storage.has(cache)) this._storage.set(cache, observable.map())
    
    if (func === undefined && this._storage.get(cache).has(key))
      return this._storage.delete(key)

    if (typeof func == 'function') 
      this._storage.get(cache).set(key, func(key))
    else if (func) 
      this._storage.get(cache).set(key, func)

    return this._storage.get(cache).get(key)
  },

  find (cache, key, val = undefined) {
    if (typeof cache != 'string')
      throw new TypeError('cache buckets must be strings')
    
    if (!this._storage.has(cache) && val === undefined) return undefined
    
    if (!this._storage.get(cache).has(key) && func)
      if (typeof func == 'function') 
        this._storage.get(cache).set(key, func(key))
      else if (func) 
        this._storage.get(cache).set(key, func)

    return this._storage.get(cache).get(key)
  },
})

export default Cache