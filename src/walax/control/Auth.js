import m from 'mithril'
import { observable, action } from 'mobx'
import Control from './Control'

export default class Auth extends Control {
    constructor(wlx) {
        super()
        if (typeof Storage === 'undefined') {
            throw 'no storage available'
        }
        this.baseUrl = undefined
    }
    load(url) {
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
    get access() {
        return this.storage.getItem('access', false)
    }
    get refresh() {
        return this.storage.getItem("refresh", false)
    }
    set access(x) {
        return this.storage.setItem('access', x)
    }
    set refresh(x) {
        return this.storage.getItem("refresh", x)
    }
    get state() {
        return this.access // fixme && this.refresh //fixme
    }

    // fixme multiple "realm" auth/object pairings?
    set url(u) {
        this.d('setting url to ' + u)
        this.baseUrl = u.replace(/\/*$/, '')
    }
    authenticate(alias, passcode, baseUrl = undefined) {
        baseUrl ||= this.baseUrl
        this.a(baseUrl, 'no url for authentication')
        if (this.state) {
            this.d('already logged in')
            return true
        }
        this.d(baseUrl + '/auth/token/')
        w.net
            .post(
                // fixme: dunno
                baseUrl + '/auth/token/',
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
            })
            .catch(err => this.e(err))

    }
    refreshToken() { } //TODO
}
