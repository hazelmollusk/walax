import WalaxMain from '../Walax'

// could be split into Logger, Signaller.. but why?

export default class WalaxEntity {
  static _miss = 0
  _init = false
  constructor (w) {}
  init (...data) {
    if (!this._init) this._init = this.initialize(...data)
  }
  initialize () {}
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
  a (cond, msg, ...dbg) {
    w.log.assert(cond, msg, this._daeiGetName(), ...dbg)
  }
  i (...msg) {
    w.log.info(this._daeiGetName(), ...msg)
  }

  _daeiGetName () {
    if (this.daeiName) return this.daeiName
    if (this.toString) return this.toString()
    return 'Walax Entity'
  }

  _signal = new Set()
  // we get signal
  addSignal (s) {
    this._signal.add(s)
  }
  // make your time
  removeSignal (s) {
    this._signal.delete(s)
  }
  // children should override to recv signals
  // if it adds its own signals, should call super
  signal (sig) {
    this._signal.forEach(x => (x.signal ? x.signal(sig) : false))
  }
}
