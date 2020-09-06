import { observable } from 'mobx'

const stackinfo = require('stackinfo')

export const FATAL = 0
export const ERROR = 1
export const WARN = 2
export const INFO = 4
export const DEBUG = 8
export const TRACE = 16

const COLOR = []

COLOR[DEBUG] = {
  fg: 'lightblue',
  bg: '#555',
  border: 'purple'
}

COLOR[INFO] = {
  fg: 'lightblue',
  bg: '#555',
  border: '#bada55'
}

COLOR[ERROR] = {
  fg: 'white',
  bg: 'red',
  border: 'white'
}

export const consoleLog = (msg, lvl, stack) =>
  console.log(
    // tpdp any need to check for chrome here?
    // todo make "walax" configurable via proxy logging class
    `%cWalax %c${msg.shift()}`,
    'color: #55aa23; \
     font-family: "Helvetica", "Verdana", "Arial", sans-serif; \
     font-variant: small-caps; \
     font-weight: bold; \
     font-size: small; \
    ',
    `font-size: large; \
      font-variant: small-caps; \
      font-weight: bold; \
      font-family: "Times New Roman", serif; \
      margin: 5px; \
      border-width: 4px;  \
      border-style: ridge; \
      border-bottom-left-radius: 15px; \
      border-top-right-radius: 15px; \
      padding: 5px; \
      color: ${COLOR[lvl]?.fg || 'white'}; \
      background-color: ${COLOR[lvl]?.bg || 'black'}; \
      border-color: ${COLOR[lvl]?.border || 'gray'}; `,
    ...msg
  )
// &&
// stack &&
// console.log('%c trace', 'font-size: large; color:green;', stack)

consoleLog.multiple = true

export const recordLogs = (msg, lvl, stack) => recordLogs.logs.add(msg)
recordLogs.logs = observable.set()

export const Logger = {
  all: new Set(),
  level: DEBUG,
  // stack: falsefalse,
  stack: false,

  /**
   * registers a callback: (msg, level) => { ..logging.. }
   *
   * @param {*} cb
   */
  register (cb) {
    this.all.add(cb)
  },

  /**
   * public methods for each log level.  accepts arbitrary
   * argument list, and logs each item individually
   *
   * @param {*} s
   */
  async fatal (...s) {
    return this._shouldLog(FATAL) && this._log(s, FATAL)
  },
  async info (...s) {
    return this._shouldLog(INFO) && this._log(s, INFO)
  },
  async warn (...s) {
    return this._shouldLog(WARN) && this._log(s, WARN)
  },
  async error (...s) {
    return this._shouldLog(ERROR) && this._log(s, ERROR)
  },
  async debug (...s) {
    return this._shouldLog(DEBUG) && this._log(s, DEBUG)
  },
  async trace (...s) {
    return this._shouldLog(TRACE) && this._log(s, TRACE)
  },
  assert (val, msg, name = false, dbginfo = false) {
    if (!val) {
      this.error(name || '<assert>', msg, dbginfo)
      throw new TypeError(msg)
      // crash and reload?  what now?
    }
  },
  _shouldLog (level) {
    return this.level >= level
  },

  async _log (s, level = INFO) {
    let promises = []
    let stack = this.stack && this._shouldLog(DEBUG) ? stackinfo() : false
    this.all.forEach((v, k, z) => {
      if (v.multiple) promises.push(this._processLog(v, s, level, stack))
      else
        s.forEach(msg => promises.push(this._processLog(v, msg, level, stack)))
      if (stack) s.forEach(msg => this._processLog(v, stack, TRACE))
    })

    return promises
  },

  async _processLog (cb, msg, level, stack = null) {
    return cb(msg, level, stack)
  },

  debugger (name) {
    return (...msg) => Logger.debug(name, ...msg)
  },
  asserter (name) {
    return (cond, msg, d) => Logger.assert(cond, msg, name, d)
  }
}

export default Logger
