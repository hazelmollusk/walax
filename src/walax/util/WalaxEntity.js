import WalaxMain from '../Walax'

export default class WalaxEntity {
  static _miss = 0
  constructor (w) {}
  logSetup () {}
  toString () {
    return 'Walax Entity'
  }
  d (...msg) {
    w.log.debug(this._daeiGetName(), ...msg)
  }
  e (...msg) {
    // if (w.DEBUG)
    //   w.log.debug(name || this._daeiGetName(), dbg)
    w.log.error(this._daeiGetName(), ...msg)
  }
  a (cond, errmsg, ...dbg) {
    w.log.assert(cond, errmsg, this._daeiGetName(), ...dbg)
  }
  i (...msg) {
    w.log.info(this._daeiGetName(), ...msg)
  }

  _daeiGetName () {
    if (this._daeiName) return this._daeiName
    if (this.toString) return this.toString()
    return 'Walax Entity'
  }
}
