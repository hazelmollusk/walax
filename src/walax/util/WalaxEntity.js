import WalaxMain from '../Walax'

export default class WalaxEntity {
  static _miss = 0
  _init = false
  constructor (w) {}
  init (...data) {
    if (!this._init) this._init = this.initialize(...data)
  }
  initialize () {}
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

  toString () {
    return 'Walax Entity'
  }

  _daeiGetName () {
    if (this._daeiName) return this._daeiName
    if (this.toString) return this.toString()
    return 'Undefined Entity'
  }
}
