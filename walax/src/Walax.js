import WalaxObjects from './control/WalaxObjects'
import WalaxNetwork from './control/WalaxNetwork'
import WalaxLogger from './control/WalaxLogger'

const { observable } = require('mobx')

export const Walax = observable({
  all: new Set(),
  keys: new Map(),

  isValidProp (key) { 
    if (!name) return false
    if ((typeof name) != 'string') return false
    if (name.search('^\w') != -1) return false
    return true
  },

  checkName(key) {
    if (!this.isValidProp(key))
      throw new TypeError(`invalid cosmponent name ${key}`)
    if (this.keys.has(key))
      throw new TypeError(`component ${key} already registered`)
    return  True
  },

  register (cmp, key = false, ...args) {
    if (this.all.has(cmp))
      throw new TypeError(`attempted re-registration of ${key}`)
    
    this.all.add(cmp)
    if (this.checkName(key)) {
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
Walax.register(WalaxObjects, 'obj')

export const w = Walax
export default w
