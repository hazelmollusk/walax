// WARN do not use 'w' in anything that gets called
// on instantiation.
import w from '../Walax'
/*
  this base class supplies methods for:
    * initialization (post-instantiation)
    * logging shortcuts
    * signalling
*/

export default class Entity {
    constructor() { }

    toString() {
        return 'Walax Entity'
    }

    /*
      sets up logging shortcuts that automatically tag
      logs with this objects ident 
    */
    _daeiName = false
    // override to set a dynamic log name that isn't toString()
    _daeiGetName() {
        return this._daeiName
            ? this._daeiName
            : this.toString
                ? this.toString()
                : 'Walax Entity'
    }
    d(...msg) {
        w?.log?.debug(
            this._daeiGetName(),
            ...msg
        )
    }
    e(...msg) {
        w?.log?.error(
            this._daeiGetName(),
            ...msg
        )
        throw new TypeError(msg[0])
    }
    a(cond, msg, ...dbg) {
        w?.log?.assert(
            this._daeiGetName(),
            ...msg
        )
    }
    i(...msg) {
        w?.log?.info(
            this._daeiGetName(),
            ...msg
        )
    }

    /* components */
    addComponent(cmp, key = undefined, ...args) {
        let newCmp = new cmp(...args)
        key ||= cmp.name
        this.addSignal(newCmp)
        if (w.isValidProp(key)) this.augment(this, key, () => newCmp)

        return cmp
    }

    /* 
      we get signal
    */
    _signal = new Set()
    // main screen turn on
    addSignal(s) {
        this._signal.add(s)
    }
    // make your time
    removeSignal(s) {
        this._signal.delete(s)
    }
    // children should override to recv signals
    // if it adds its own signals
    // should return boolean
    handleSignal(src, ...sig) {
        return true
    }
    receiveSignal(src, ...sig) {
        this?.d(`signal "${sig[0]}" => ${w.callable(this, sig[0]) ? 'method' : 'handleSignal'}`,
            { src }, { sig })
        return (w.callable(this, sig[0])) ?
            this[sig.shift()](src, ...sig) :
            this.handleSignal(src, ...sig)
    }
    init(src, ...sig) {
        this._w ||= {}
        this._w.setup ||= this.signal('setup')
    }
    // override for run-once initialization
    setup(src, ...sig) { }
    // children may override to remove hierarchy
    sendSignal(src, ...sig) {
        this.receiveSignal(src, ...sig)
        this._signal.forEach(x =>
            x.receiveSignal instanceof Function
                ? x.sendSignal(src, ...sig)
                : x instanceof Function
                    ? x(src, ...sig)
                    : undefined
        )
    }
    signal(...sig) {
        let target = (sig[0] && typeof sig[0] != 'string') ? sig.shift() : this
        this.sendSignal(target, ...sig)
    }
}
