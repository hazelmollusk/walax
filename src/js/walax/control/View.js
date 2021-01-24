import m from 'mithril'
import Control from './Control'


export default class View extends Control {
    constructor() {
        super()
    }
    toString() {
        return 'View'
    }
    toggle(elm) {
        if (typeof elm == 'string') elm = document.getElementById(elm)
        elm.style.display = elm.style.display == 'none' ? 'block' : 'none'
    }
    get screen() {
        if (!this._screen) {
            let body = document.body
            let scrCmp = {
                view: () => m('.screen#screen', [m('.nav#nav'), m('.main#main')])
            }
            m.mount(body, scrCmp)
            this._screen = true
        }
        return document.getElementById('screen')
    }
    get login() {
        return {
            view: () => m('.login#login', m('form.login#loginForm', [
                m('input[type=text][autocomplete=username].login.loginName#username'),
                m('input[type=password][autocomplete=current-password].login.loginPass#password'),
                m('input[type=submit].loginSubmit', {
                    onclick: () => {
                        w.auth.authenticate(document.getElementById('username').value,
                            document.getElementById('password').value)
                    }
                })
            ]))
        }
    }

    addNav(cmp) {
        this.tabCount ||= 0
        this.tabCount += 1
        let main = document.getElementById('main')
        let newTab = m(`.tab#${tabId}`, m(cmp))

        return {
            view: () => m('nav#nav')
        }
    }
}
