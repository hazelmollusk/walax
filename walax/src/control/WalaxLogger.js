const FATAL = 0
const ERROR = 1
const WARN = 2
const INFO = 4
const DEBUG = 8

export const consoleLog = (msg, lvl) => console.log(msg)
export const recordLogs = (msg, lvl) => true // fixne

export const WalaxLogger = {
  all: new Set(),
  level: INFO,

  /**
   * registers a callback: (msg, level) => { ..logging.. }
   *
   * @param {*} cb
   */
  register (cb) { this.all.add(cb) },

  /**
   * public methods for each log level.  accepts arbitrary
   * argument list, and logs each item individually
   *
   * @param {*} s
   */
  fatal  (...s) { return (this.level >= FATAL) || this._log(s, INFO) },
  info   (...s) { return (this.level >= INFO) || this._log(s, INFO) },
  warn   (...s) { return (this.level >= WARN) || this._log(s, WARN) },
  error  (...s) { return (this.level >= ERROR) || this._log(s, ERROR) },
  debug  (...s) { return (this.level >= DEBUG) || this._log(s, DEBUG) },

  async _log (s, level = INFO) {
    return Array.isArray(s)
      ? s.map(x => this._log(x, level))
      : this._processLog(s, level)
  },

  async _processLog (msg, level) {
    this.all.forEach((f, k, s) => f(msg, level))
  }
}

export default WalaxLogger