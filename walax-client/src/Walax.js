const { observable } = require('mobx')

class Walax extends Object {
  static _instances = observable.map() 

  static get instance (key = false) {
    key = key || -47
    if (!this._instances.has(key)) 
      this._instances.set(key, observable.box(new this(key)))
    
    return this._instances.get(key)
  }
}

export default Walax
