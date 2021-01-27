import m from 'mithril'
import Control from './Control'


export default class View extends Control {
    _pages = new Set()
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
                        console.log('clicked')
                        w.auth.authenticate(document.getElementById('username').value,
                            document.getElementById('password').value)
                        if (w.auth.state) this.display()
                        return false
                    }
                })
            ]))
        }
    }

    display() {
        let body = document.getElementsByTagName('body')[0]
        m.render(body, m('.screen#screen', [m('.nav#nav'), m('.main#main')]))
        let nav = document.getElementById('nav')
        let main = document.getElementById('main')
        if (w.auth.state) {
            let pages = {}
            let navs = []
            let defPage = undefined
            this._pages.forEach(v => {
                defPage ||= v.url
                this.d('foo', v.url)
                pages[v.url] = v.page
                this.d('var', pages)
                navs.push(m('a.nav', { href: '#!' + v.url }, v.nav))
            })

            this.d('building display routes', { main }, { defPage }, { pages }, { navs })
            m.render(nav, m({ view: vnode => m('.navbar', {}, navs) }))
            let p = pages['/home']
            this.d(p)
            m.route(main, defPage, {
                '/home': p
            })
        } else {
            m.render(nav, m('.loginNav'))
            m.mount(main, this.login)
        }
    }

    addPage(page) {
        this._pages.add(page)
    }
}
