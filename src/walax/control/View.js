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
            view: () => m('.login#login', m('form.login#loginForm', { method: 'post' }, [
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
    get page() {
        let body = document.body
        let main = document.getElementById('main')
        let nav = document.getElementById('nav')
        let screen = document.getElementById('screen')
        if (!screen) {
            body.innerHTML += '<div id="screen" />'
            screen = document.getElementById('screen')
        }
        if (!nav) {
            screen.innerHTML += '<div id="nav" />'
            nav = document.getElementById('nav')
        }
        if (!main) {
            screen.innerHTML += '<div id="main" />'
            main = document.getElementById('main')
        }

        return { screen, main, nav }
    }
    get nav() {
        return this.page.nav
    }
    get main() {
        return this.page.main
    }

    setup() { }

    display() {
        let nav = this.nav
        let main = this.main
        let pages = {}
        let navs = []
        let defPage = undefined
        this._pages.forEach(v => {
            if (!defPage || v.default)
                defPage = v.url
            pages[v.url] = v.page
            navs.push(m('a.nav', { href: '#!' + v.url }, v.nav))
        })

        this.d('building display routes', { main }, { defPage }, { pages }, { navs })
        m.render(nav, m({ view: vnode => m('.navbar', {}, navs) }))
        let p = pages['/home']
        this.d(p)
        m.route(main, defPage, pages)
    }

    addPage(page) {
        this._pages.add(page)
    }

    addNavLogo(label, img = undefined) {
        this.nav.innerHTML = '<div class="logo">' + label + '</div>' + this.nav.innerHTML
    }
}
