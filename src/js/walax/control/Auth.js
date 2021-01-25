import m from 'mithril'
import walax from '../Walax'
import { observable, action } from 'mobx'
import Control from './Control'

export default class Auth extends Control {
    constructor(wlx) {
        super()
        this.access = 'no'
        this.refresh = 'no'
        this.state = false
        this.loaded = false
        if (typeof Storage === 'undefined') {
            throw 'no storage available'
        }
    }
    setup() {
        this.loadStorage()
    }
    toString() {
        return 'Auth'
    }

    getAccess() {
        return this.access
    }
    authenticate(alias, passcode) {
        if (this.state) {
            this.d('already logged in')
            return true
        }
        w.net
            .post(
                // fixme: dunno
                w.url + 'auth/token/',
                {
                    username: alias,
                    password: passcode
                },
                {
                    username: alias,
                    password: passcode
                }
            )
            .then(result => {
                this.i('authenticated')
                this.access = result.access
                this.refresh = result.refresh
                this.state = true
            })
            .catch(err => this.e(err))

    }
    refreshToken() { } //TODO
    loadStorage() {
        var s = window.localStorage
        var access = s.getItem('access')
        var refresh = s.getItem('refresh')
        if (access && refresh) {
            this.i('authenticated')
            this.access = access
            this.refresh = refresh
            this.state = true
        }
        this.d('loaded', { access }, { refresh }, { state: this.state })
    }
    saveStorage() {
        var s = window.localStorage
        s.access = this.access
        s.refresh = this.refresh
    }
}
