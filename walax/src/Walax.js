import WalaxController from './walax/WalaxController'
import WalaxNetwork from './walax/WalaxNetwork'
import WalaxLogger from './walax/WalaxLogger'

const { observable } = require('mobx')

export const Walax = observable({
  all: new Map(),
  keys: new Set(),

  isValidProp (key) { return !this.keys.has(key) /* fixme */ },

  register (Klass, key = false, ...args) {
    if (!this.all.has(Klass)) {
      const controller = new Klass(...args)
      this.all.set(Klass, controller)
      if (this.isValidProp(key)) {
        this.keys.set(key, all.get(Klass))
        Object.defineProperty(this, key, {
          get: function () { return this.keys.get(key) }
        }) 
      }
    }
    return this.all.get(Klass)
  }
}

Walax.register(WalaxLogger, 'log')
Walax.register(WalaxNetwork, 'net')
Walax.register(WalaxObject, 'obj'))

export const w = Walax
export default w
