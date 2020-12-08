import WalaxMain from '../Walax'

export default class WalaxEntity {
  static _miss = 0
  constructor (w) {
  }
  logSetup () {
    WalaxMain?.log?.daei(this)
  }
}
