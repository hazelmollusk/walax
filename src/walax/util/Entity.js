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
    constructor() { 
    }

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
    }
    a(cond, msg, ...dbg) {
        w.log.assert(cond,
            msg,
            dbg
        )
    }
    i(...msg) {
        w?.log?.info(
            this._daeiGetName(),
            ...msg
        )
    }

}
