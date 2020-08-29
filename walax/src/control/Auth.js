import m from 'mithril'
import w from '../Walax'
import { observable, action } from 'mobx'

const Auth = observable({
  getAccess: function () { return this.access },
  access: 'no',
  refresh: 'no',
  state: false,
  loaded: false,
  authenticate: function (alias, passcode) {
    if (!this.loaded) { this.initialize() }
    if (this.access && this.refresh) {
      w.log.debug('already logged in')
      this.state = true
      return
    }
    h.post('/api/token/', {
      username: alias,
      password: passcode
    }, {
      username: alias,
      password: passcode
    }).then(function (result) {
      this.access = result.access
      this.refresh = result.refresh
      this.state = true
    }).catch(function (err) {
      w.log.error(err)
    })
  },
  refreshToken: function () {

  },
  loadStorage: function () {
    var s = window.localStorage
    var access = s.getItem('access')
    var refresh = s.getItem('refresh')
    if (access && refresh) {
      this.access = access
      this.refresh = refresh
      this.state = true
    }
  },
  saveStorage: function () {
    var s = window.localStorage
    s.access = this.access
    s.refresh = this.refresh
  },
  initialize: function () {
    w.log.debug('auth init called')
    if (typeof (Storage) === 'undefined') { throw 'no storage available' }

    this.loadStorage()
    this.loaded = true
  }
})

export default Auth