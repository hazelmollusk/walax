import { observable } from 'mobx'
import Control from './Control'

export const FATAL = 0
export const ERROR = 1
export const WARN = 2
export const INFO = 4
export const DEBUG = 8
export const TRACE = 16

const LEVELS = [FATAL, ERROR, WARN, INFO, DEBUG, TRACE]

const COLOR = []
LEVELS.map(
  x =>
    (COLOR[x] = {
      fg: 'silver',
      bg: '#111',
      border: 'lightblue'
    })
)

COLOR[DEBUG].border = 'purple'

COLOR[INFO] = {
  fg: 'lightblue',
  bg: '#555',
  border: '#bada55'
}

COLOR[WARN] = {}

COLOR[ERROR] = {
  fg: 'white',
  bg: 'red',
  border: 'white'
}

export const consoleLog = (msg, lvl, stack) => {
  if (msg.length > 1 && typeof msg[1] != 'string')
    msg.unshift(msg.shift(), '-----')
  console.log(
    // tpdp any need to check for chrome here?

    // todo make "walax" configurable via proxy logging class
    `%c ${msg.shift()}%c≣%c ${msg.shift()}`,
    'color: #557723; \
     font-family: "Times New Roman", serif; \
     font-weight: bold; font-variant: small-caps; \
     font-size: medium; padding: 3px; \
    ',
    '',
    `font-size: medium; \
      font-family: "Courier New", "Times New Roman", serif; \
      font-size: small; font-variant: small-caps; \
      padding: 3px; color: ${COLOR[lvl]?.fg || 'white'}; `,
    ...msg
  )
}
consoleLog.multiple = true

export const recordLogs = (msg, lvl, stack) => recordLogs.logs.add(msg)
recordLogs.logs = new Set()

export class Logger extends Control {
  all = new Set()
  level = TRACE
  stack = false

  constructor () {
    super()
  }
  toString () {
    return 'Log'
  }
  getPropName () {
    return 'log'
  }
  /**
   * registers a callback: (msg, level) => { ..logging.. }
   *
   * @param {*} cb
   */
  register (cb) {
    this.all.add(cb)
  }

  /**
   * public methods for each log level.  accepts arbitrary
   * argument list, and logs each item individually
   *
   * @param {*} s
   */

  _shouldLog (level) {
    return this.level >= level
  }
  async fatal (...s) {
    return this._shouldLog(FATAL) && this._log(s, FATAL)
  }
  async info (...s) {
    return this._shouldLog(INFO) && this._log(s, INFO)
  }
  async warn (...s) {
    return this._shouldLog(WARN) && this._log(s, WARN)
  }
  async error (...s) {
    return (
      this._shouldLog(ERROR) &&
      this._log(s, ERROR) &&
      console.error(...s) &&
      console.trace()
    )
  }
  async debug (...s) {
    return this._shouldLog(DEBUG) && this._log(s, DEBUG)
  }
  async trace (...s) {
    return this._shouldLog(TRACE) && this._log(s, TRACE, true)
  }
  assert (val, msg, dbginfo = false) {
    if (!val) {
      this.error('assert failed', msg, dbginfo || undefined)
      // this.error(name || '<assert>', msg, dbginfo)
      throw new TypeError(msg)
      // crash and reload?  what now?
    }
  }

  async _log (s, level = INFO, stack) {
    let promises = []
    this.all.forEach((v, k, z) => {
      if (v.multiple) promises.push(this._processLog(v, s, level, stack))
      else
        s.forEach(msg => promises.push(this._processLog(v, msg, level, stack)))
      if (stack) {
        let stackError = new Error()
        promises.push(this._processLog(v, [stackError.stack], TRACE))
      }
    })

    return promises
  }

  async _processLog (cb, msg, level, stack = null) {
    return cb(msg, level, stack)
  }
  toString () {
    return 'Logger'
  }
}

export default { Logger, consoleLog, recordLogs }
