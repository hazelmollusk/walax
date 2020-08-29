import { observable } from 'mobx'

const stackinfo = require('stackinfo')

export const FATAL = 0
export const ERROR = 1
export const WARN = 2
export const INFO = 4
export const DEBUG = 8
export const TRACE = 16


export const consoleLog = (msg, lvl, stack) => console.log(msg)
export const recordLogs = (msg, lvl, stack) => recordLogs.logs.add(msg)
recordLogs.logs = observable.set()

export const Logger = {
  all: new Set(),
  level: DEBUG,
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

  _shouldLog (level) {
    return this.level >= level
  },

  async _log (s, level = INFO) {
    let promises = []
    let stack = this.stack && this._shouldLog(DEBUG) ? stackinfo() : false
    this.all.forEach((v, k, z) => {
      s.forEach(msg => promises.push(this._processLog(v, msg, level, stack)))
      if (stack) s.forEach(msg => this._processLog(v, stack, TRACE))
    })

    return promises
  },

  async _processLog (cb, msg, level, stack = null) {
    return cb(msg, level, stack)
  }
}

export default Logger