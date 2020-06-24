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

const WalaxLogger = {
  all: observable.set(),

  /**
   * registers a callback: (msg, level) => { ..logging.. }
   *
   * @param {*} cb
   */
  register (cb) { this.all.add(cb)     },


  /**
   * public methods for each log level.  accepts arbitrary
   * argument list, and logs each item individually
   *
   * @param {*} s
   */
  info   (...s) { this._log(s, INFO)   },
  warn   (...s) { this._log(s, WARN)   },
  error  (...s) { this._log(s, ERROR)  },
  debug  (...s) { this._log(s, DEBUG)  },
  debug1 (...s) { this._log(s, DEBUG1) },
  debug2 (...s) { this._log(s, DEBUG2) },

  async _log (s, level = INFO) {
    return Array.isArray(s) 
      ? s.map(x => this._log(x, level))
      : this._processLog(s, level)
  },
  async _processLog (msg, level) {
    this.all.forEach((f, k, s) => f(msg, level))
  }
}

const WalaxController = {
  all: observable.set(),
  instances: observable.map(),

  isValidProp (prop) { return prop /* fixme */ },
  instance (cls, key = false, prop = false) {
    prop ||= key
    key  ||= prop || DEFAULT 

    if (!this.instances.has(cls))
      this.instances.set(cls, observable.map())
    let classes = this.instances.get(cls)
    if (!classes.has(key)) {
      classes.set(key, observable.box(new cls(key)))
      this.all.add(classes.get(key).get())
      if (this.isValidProp(prop))
        Object.defineProperty(this, prop, {
          get: function () {
            return this.instance(cls, prop, key)
          }
        })
    }
    return classes.get(key).get()  // return the unboxed instance
  },
}

const WalaxNetwork = {
  /**
   * public methods for each HTTP method
   * 
   * @param {*} url
   * @param {*} params
   * @param {*} body
   * @param {*} options
   * @returns {Promise}
   */
  async post    (u, p, b, o) { return this._req(this._reqOpts(...[u, p, b, o, 'POST'    ])) },
  async get     (u, p, b, o) { return this._req(this._reqOpts(...[u, p, b, o, 'GET'     ])) },
  async put     (u, p, b, o) { return this._req(this._reqOpts(...[u, p, b, o, 'PUT'     ])) },
  async delete  (u, p, b, o) { return this._req(this._reqOpts(...[u, p, b, o, 'DELETE'  ])) },
  async options (u, p, b, o) { return this._req(this._reqOpts(...[u, p, b, o, 'OPTIONS' ])) },
  async patch   (u, p, b, o) { return this._req(this._reqOpts(...[u, p, b, o, 'PATCH'   ])) },

  /**
   * pass a request through to mithril
   *
   * @param {*} options
   * @returns {Promise}
   */
  async _req (options) {
    if (!options.headers) options.headers = { Accept: 'application/vnd.oai.openapi+json, application/json' }
    if (!this._chkOpts(options))
      throw new Error('invalid request options')
    return m.request(options) 
  },

  /**
   * check validity of request options object
   *
   * @param {object} opts
   * @returns {boolean}
   */
  _chkOpts (opts) {
    // todo better sanity?
    return opts.url && opts.method
  },

  /**
   * formats parameters into request options for mithril
   *
   * @param {string} url
   * @param {object} params
   * @param {object} body
   * @param {object} options
   * @param {string} [method='GET']
   * @returns {object}
   */
  _reqOpts (url, params, body, options, method = 'GET') {
    let opts = {...{ url, params, body, method }, ...(options || {})}
    //todo defaults?
    return opts
  },
}

export const Walax = {
  get log () { return WalaxLogger },
  get net () { return WalaxNetwork },
  get ctl () { return WalaxController },
}

export const w = Walax
export default Walax
