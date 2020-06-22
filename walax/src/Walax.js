const { observable } = require('mobx')
const m = require('mithril')

const FATAL = 0
const ERROR = 1
const WARN = 2
const INFO = 4
const DEBUG = 8
const DEBUG1 = 9
const DEBUG2 = 10
const DEFAULT = '_WLX_DEF'

var logLevel = DEBUG

const WalaxController = {
  all: observable.set(),
  _instances: observable.map(),

  instance (cls, key = false) {
    key ||= DEFAULT
    if (!this._instances.has(cls))
      this._instances.set(cls, observable.map())
    let classes = this._instances.get(cls)
    if (!classes.has(key))
      classes.set(key, observable.box(new cls(key)))

    return classes.get(key)
  },
  register (cls, key = false)  { 
    this.all.add(this.instance(cls, key))
  }
}

const WalaxNetwork = {
  post (...args)     { return this._req(this._reqOpts(...[...args, 'POST'])) },
  get (...args)      { return this._req(this._reqOpts(...[...args, 'GET'])) },
  put (...args)      { return this._req(this._reqOpts(...[...args, 'PUT'])) },
  delete (...args)   { return this._req(this._reqOpts(...[...args, 'DELETE'])) },
  options (...args)  { return this._req(this._reqOpts(...[...args, 'OPTIONS'])) },
  patch (...args)    { return this._req(this._reqOpts(...[...args, 'PATCH'])) },

  _req (options)     { return m.request(options) },

  _reqOpts (url, params, body, options, method = 'GET') {
    // TODO sanity checking
    let opts = {...{ url, params, body, method }, ...(options || {})}
    return opts
  },

}

const WalaxLogger = {
  all: observable.set(),

  register(cb)  { this.all.add(cb)     },
  info   (...s) { this._log(s, INFO)   },
  warn   (...s) { this._log(s, WARN)   },
  error  (...s) { this._log(s, ERROR)  },
  debug  (...s) { this._log(s, DEBUG)  },
  debug1 (...s) { this._log(s, DEBUG1) },
  debug2 (...s) { this._log(s, DEBUG2) },

  _log (s, level = INFO) {
    return Array.isArray(s) 
      ? s.map(function (x) { return this._log(x, level) })
      : this._processLog(this, s, level)
  },
  _processLog (sender, msg, level) {
    this.all.forEach((f, k, s) => f(sender, msg, level))
  }

}

const Walax = observable.box({
  log:  WalaxLogger,
  net:  WalaxNetwork,
  ctrl: WalaxController
})

export default Walax
