import { logicalExpression } from '@babel/types'
import { observable } from 'mobx'
import w from '../Walax'
import Control from './Control'

const stackinfo = require('stackinfo')

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
/**
 * a simple, colorful console logging plugin
 *
 * @export
 * @param {*} msg
 * @param {*} lvl
 * @param {*} stack
 */
export const consoleLog = (msg, lvl, stack) =>
  console.log(
    // todo make "walax" configurable via proxy logging class
    // `%c⋞%c༺⟅༼₩₳₤Ⱥ᙭༽⟆༻%c≽%c⟹%c≣ ${msg.shift()}`,
    `%c⋞%c༺⟅༼Walax༽⟆༻%c≽%c⟹%c≣ ${msg.shift()}`,
    'color: #66bb34; font-size: medium;',
    'color: #55aa23; \
     background-color: #090c09; \
     font-family: "Helvetica", "Verdana", "Arial", sans-serif; \
     font-weight: bold; font-variant: small-caps; \
     font-size: x-small; \
     border: 2px solid #66bb34; \
     padding: 1px; \
     padding-top: 3px; \
     border-radius: 11px; \
     border-radius-top-left: 0px; \
     border-radius-top-right: 0px; \
    ',
    'color: #66bb34; font-size: medium;',
    'color: pink; font-size: medium;',
    `font-size: medium; \
      font-variant: small-caps; \
      font-family: "Times New Roman", serif; \
      font-family: "Verdana", "Arial", sans-serif; \
      margin: 5px; \
      margin-left: 0px; \
      border-width: 4px;  \
      border-style: ridge; \
      border-bottom-left-radius: 15px; \
      border-top-right-radius: 15px; \
      padding: 4px; \
      padding-top: 0px; \
      color: ${COLOR[lvl]?.fg || 'white'}; \
      background-color: ${COLOR[lvl]?.bg || 'black'}; \
      border-color: ${COLOR[lvl]?.border || 'gray'};  `,
    ...msg
  )

consoleLog.multiple = true
/**
 * a simple logging plugin that records logs (can be @observed)
 *
 * @export
 * @param {*} msg
 * @param {*} lvl
 * @param {*} stack
 */
export const recordLogs = (msg, lvl, stack) => recordLogs.logs.add(msg)
recordLogs.logs = new Set()

/**
 * Generic logging interface
 *
 * @export
 * @class Logger
 * @extends {Control}
 */
export class Logger extends Control {
  all = new Set()
  level = DEBUG
  stack = false

  constructor () {
    super()
  }

  /**
   * registers a callback (plugin):
   * (msg, level) => { <logging code> }
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
  /* async */   fatal (...s) {
    return this._shouldLog(FATAL) && this._log(s, FATAL)
  }
  /* async */   info (...s) {
    return this._shouldLog(INFO) && this._log(s, INFO)
  }
  /* async */   warn (...s) {
    return this._shouldLog(WARN) && this._log(s, WARN)
  }
  /* async */   error (...s) {
    return this._shouldLog(ERROR) && this._log(s, ERROR)
  }
  /* async */   debug (...s) {
    return this._shouldLog(DEBUG) && this._log(s, DEBUG)
  }
  /* async */   trace (...s) {
    return this._shouldLog(TRACE) && this._log(s, TRACE)
  }
  assert (val, msg, ...args) {
    if (!val) {
      this.error(msg, ...args)
      throw new TypeError(msg)
      // crash and reload?  what now?
    }
  }
  
  /* async */   _log (s, level = INFO, obj = null) {
    let promises = []
    let stack = this.stack && this._shouldLog(DEBUG) ? stackinfo() : false
    this.all.forEach((v, _k, z) => {
      if (v.multiple) promises.push(this._processLog(v, s, level, stack))
      else
        s.forEach(msg => promises.push(this._processLog(v, msg, level, stack)))
      if (stack) promises.push(this._processLog(v, stack, TRACE))
    })

    return promises
  }

  /* async */   _processLog (cb, msg, level, stack = null) {
    return cb(msg, level, stack)
  }
  toString () {
    return 'Logger'
  }
  debugger (name) {
    // return (...msg) =>
    return (...msg) => this.debug(name, ...msg)
  }
  errorer (name) {
    return (msg, dbg) => {
      this.error(name, msg)
      if (dbg) this.debug(name, dbg)
      /* throw new TypeError(msg) ?? */
    }
  }
  asserter (name) {
    return (cond, msg, d) => this.assert(cond, msg, name, d)
  }
  informer (name) {
    return (...msg) => this.info(name, ...msg)
  }
  daei (obj, name = undefined) {
    if (name) this._daeiName = name
    return Object.entries({
      d: this.debugger(name),
      a: this.asserter(name),
      e: this.errorer(name),
      i: this.informer(name)
    }).forEach(v => {
      w.augment(obj, v[0], v[1])
    })
  }
}

export default { Logger, consoleLog, recordLogs }