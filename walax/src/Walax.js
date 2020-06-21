const { observable } = require('mobx')
const m = require('mithril')

const FATAL = 0
const ERROR = 1
const WARN = 2
const INFO = 4
const DEBUG = 8
const DEBUG1 = 9
const DEBUG2 = 10

class Walax extends Object {
  static _instances = observable.map()
  static _loggers = observable.set()

  static get instance (key = false) {
    key = key || -47
    if (!this._instances.has(key)) 
      this._instances.set(key, observable.box(new this(key)))
    
    return this._instances.get(key)
  }

  /* logging shortcuts */

  static logLevel = DEBUG
  info   (...s) { this._log(s, INFO)   }
  warn   (...s) { this._log(s, WARN)   }
  error  (...s) { this._log(s, ERROR)  }
  debug  (...s) { this._log(s, DEBUG)  }
  debug1 (...s) { this._log(s, DEBUG1) }
  debug2 (...s) { this._log(s, DEBUG2) }
  _log (s, level = INFO) {
    return Array.isArray(s) 
      ? s.map(function(x) { return this._log(x, level) })
      : Walax._processLog(this, x, level)
  }
  static _processLog(sender, msg, level) {
    this._loggers.forEach( f, k, s => f(sender, msg, level) )
    console.log(sender, msg)
  }
  static registerLogger(cb, t = undefined) {
    this._loggers.add(cb, t)
  }

  /* rpc shortcuts */
  requestOptions(url, params = null, body = null, options = null, method = 'GET') {
    let args = { url: url, params: params, body: body }
    let opts = {...args, ...(options || {})}
    // if (opts.url && opts.url[0] !== '/') 
    //   opts.url = h.apiPrefix + '/' + options.url

      // var access = cAuth.getAccess()  // FIXME
    // if (access) options.headers.Authorization = 'Bearer: ' + access
    return opts
  }

  post(url, params = null, body = null, options = null) {
    return this.request(this.requestOptions(url, params, body, options, 'POST'))
  }
  get(url, params = null, body = null, options = null) {
    return this.request(this.requestOptions(url, params, body, options, 'GET'))
  }
  put(url, params = null, body = null, options = null) {
    return this.request(this.requestOptions(url, params, body, options, 'PUT'))
  }
  options(url, params = null, body = null, options = null) {
    return this.request(this.requestOptions(url, params, body, options, 'OPTIONS'))
  }
  request(options) {
    this.info(options)
    return m.request(options)
  }

}
export default Walax