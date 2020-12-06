import m from 'mithril'
import walax from '../Walax'
import { observable, action } from 'mobx'
import BaseControl from './BaseControl'

export default class Auth extends BaseControl {
  constructor (wlx) {
    super()
    this.access = 'no'
    this.refresh = 'no'
    this.state = false
    this.loaded = false
  }
  getAccess () {
    return this.access
  }
  authenticate (alias, passcode) {
    if (!this.loaded) {
      this.initialize()
    }
    if (this.access && this.refresh) {
      d('already logged in')
      this.state = true
      return
    }
    w.net
      .post(
        // fixme: dunno
        '/api/token/',
        {
          username: alias,
          password: passcode
        },
        {
          username: alias,
          password: passcode
        }
      )
      .then(function (result) {
        this.access = result.access
        this.refresh = result.refresh
        this.state = true
      })
      .catch(function (err) {
        e(err)
      })
  }
  refreshToken () {} //TODO
  loadStorage () {
    var s = window.localStorage
    var access = s.getItem('access')
    var refresh = s.getItem('refresh')
    if (access && refresh) {
      this.access = access
      this.refresh = refresh
      this.state = true
    }
  }
  saveStorage () {
    var s = window.localStorage
    s.access = this.access
    s.refresh = this.refresh
  }
  initialize () {
    d('auth init called')
    if (typeof Storage === 'undefined') {
      throw 'no storage available'
    }

    this.loadStorage()
    this.loaded = true
  }
}
