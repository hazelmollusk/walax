import WalaxObject from './control/WalaxObject'
import WalaxNetwork from './control/WalaxNetwork'
import WalaxLogger from './control/WalaxLogger'

const { observable } = require('mobx')

export const Walax = observable({
  all: new Set(),
  keys: new Map(),

  isValidProp (key) { return !this.keys.has(key) /* fixme */ },

  register (cmp, key = false, ...args) {
    if (this.all.has(cmp))
      throw new TypeError(`attempted re-registration of ${key}`)
    
    this.all.add(cmp)
    if (this.isValidProp(key)) {
      this.keys.set(key, cmp)
      Object.defineProperty(this, key, {
        get: function () { return this.keys.get(key) }
      })

      // these could all be base classes with a "merge map to properties" func
    }
    
    return this.all.get(Klass)
  }
})

Walax.register(WalaxLogger, 'log')
Walax.register(WalaxNetwork, 'net')
Walax.register(WalaxObject, 'obj')

export const w = Walax
export default w
