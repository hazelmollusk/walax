const { observable } = require('mobx')

export const WalaxController = {
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

export default WalaxController
