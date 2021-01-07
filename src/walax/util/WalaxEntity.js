// WARN do not use 'w' in anything that gets called
// on instantiation.
import w from '../Walax'
/*
  this base class supplies methods for:
    * initialization (post-instantiation)
    * logging shortcuts
    * signalling
*/

export default class WalaxEntity {
  constructor () {}

  toString () {
    return 'Walax Entity'
  }

  initialize (...data) {
    this.sendSignal('init')
    this.sendSignal('go')
  }

  /*
    sets up logging shortcuts that automatically tag
    logs with this objects ident 
  */
  _daeiName = false
  // override to set a dynamic log name that isn't toString()
  _daeiGetName () {
    if (this._daeiName) return this._daeiName
    if (this.toString) return this.toString()
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

  /* 
    we get signal
  */
  _signal = new Set()
  // main screen turn on
  addSignal (s) {
    this._signal.add(s)
  }
  // make your time
  removeSignal (s) {
    this._signal.delete(s)
  }
  // children should override to recv signals
  // if it adds its own signals
  handleSignal (src, ...sig) {}
  receiveSignal (src, ...sig) {
    this.d('we get signal', { src }, { sig })
    return w.callable(this, sig[0])
      ? this[sig.shift()](src, ...sig)
      : this.handleSignal(src, ...sig)
  }
  // children may override to remove hierarchy
  sendSignal (src, ...sig) {
    this.receiveSignal(src, ...sig)
    this._signal.forEach(x =>
      x.receiveSignal instanceof Function
        ? x.sendSignal(src, ...sig)
        : x instanceof Function
        ? x(src, ...sig)
        : undefined
    )
  }
  signal (...sig) {
    this.sendSignal(this, ...sig)
  }
}
