import { observable } from 'mobx'

export class KeyedSingleton {
  static _instances = observable.map()
  static _klass = KeyedSingleton

  static getInstance (name) {}
}

// the reason for this class is
// to support objects within the
// context of a single Walax()
export class WalaxEntity {
  constructor (w) {
    this.w = w
  }
}

export default { KeyedSingleton, WalaxEntity }
