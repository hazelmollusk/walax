import { observable } from 'mobx'

// the reason for this class is
// to support objects within the
// context of a single Walax()
export class WalaxEntity {
  constructor (w) {
    this.w = w
  }
}

export default { WalaxEntity }
