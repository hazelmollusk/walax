import m from 'mithril'
import { observable, action } from 'mobx'
import Control from './Control'

export default class Auth extends Control {
    constructor() {
        super()
        if (typeof Storage === 'undefined') {
            throw 'no storage available'
        }
        this.baseUrl = undefined
    }
    load(key, url) {
        this.baseUrl = url
    }
    setup() {
    }
    toString() {
        return 'Auth'
    }
    get storage() {
        return window.localStorage
    }
    get token() { return this.access }
    get access() {
        return this.storage.getItem('access', false)
    }
    get refresh() {
        return this.storage.getItem("refresh", false)
    }
    get username() {
        return this.storage.getItem("username", false)
    }
    set access(x) {
        return this.storage.setItem('access', x)
    }
    set refresh(x) {
        return this.storage.setItem("refresh", x)
    }
    set username(x) {
        return this.storage.setItem("username", x)
    }
    get state() {
        return Boolean(this.access) // fixme && this.refresh //fixme
    }

    async logout() {
        this.storage.removeItem('access')
        this.storage.removeItem('refresh')
        this.storage.removeItem('username')
        return true
    }
    async authenticate(alias, passcode, baseUrl = undefined) {
        baseUrl ||= this.baseUrl
        this.a(baseUrl, 'no url for authentication')
        if (this.state) {
            this.d('already logged in')
            return true
        }
        this.d('authenticating', baseUrl + 'auth/token/')
        return w.net
            .post(
                // fixme: dunno
                baseUrl + 'auth/token/',
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
                this.username = alias
                return true
            })
            .catch(err => this.e(err))

    }
    refreshToken() { } //TODO
}
