
import regeneratorRuntime from "regenerator-runtime"
import { observable } from 'mobx'

import { Logger, consoleLog, DEBUG } from './control/Logger'
import Control from './control/Control'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import Test from './control/Test'

// need our own debug/asserts bc log plugin
// might not be there during instantiation of the
// walax object

// todo console logging themes (for applications)
const WDEBUG = true
const WLXBG1 =
    'background-color: green; padding: 2px; \
          color: white; border: 3px solid #bbb; \
          border-radius: 6px; font-variant: small-caps; \
          font-weight: bold; font-family: serif; \
          font-size: 16px; border-right: none; \
          border-top-right-radius: 0px; \
          border-bottom-right-radius: 0px; \
          '
const WLX1 =
    'color:green; background-color: lightgrey; padding: 2px; \
        border: 3px solid #bababa; border-radius: 8px; \
        font-weight: bold; font-family: serif; \
        font-variant: small-caps; font-size: 16px; \
        border-left: none; \
        border-top-left-radius: 0px; \
        border-bottom-left-radius: 0px; \
        '
const d = WDEBUG
    ? (t, ...m) => console.log(`%c  walax  %c ${t} `, WLXBG1, WLX1, ...m)
    : () => undefined
const WLXBG2 =
    'background-color: red; padding: 2px; \
          color: white; border: 3px solid #bbb; \
          border-radius: 6px; font-variant: small-caps; \
          font-weight: bold; font-family: serif; \
          font-size: 16px; border-right: none; \
          border-top-right-radius: 0px; \
          border-bottom-right-radius: 0px; \
          '
const WLX2 =
    'color:green; background-color: lightgrey; padding: 2px; \
        border: 3px solid #bababa; border-radius: 8px; \
        font-weight: bold; font-family: serif; \
        font-variant: small-caps; font-size: 16px; \
        border-left: none; \
        border-top-left-radius: 0px; \
        border-bottom-left-radius: 0px; \
        '
const _d_a = WDEBUG
    ? (...m) => console.log(`%c  walax  %c ASSERT FAILED `, WLXBG2, WLX2, ...m)
    : () => undefined

const a = (c, ...m) => {
    if (!c) {
        _d_a(...m)
        throw new TypeError(m[0])
    }
}
/**
 * the main interface to Walax
 *
 * @class Walax
 */
export class Walax {
    constructor(...args) {
        this.setup()
    }

    /**
     * load a named API from url
     *
     * @param {*} url
     * @param {*} key
     * @return {*}
     * @memberof Walax
     */
    async load(key, url) {
        this.plugins.forEach(plug => {
            plug.load(key, url)
        })
        this.apiBase = url  // this is broken for multiple remotes
        d(`setting apiBase to ${this.apiBase}`)
        return true
    }

    toString() {
        return 'WALAX'
    }

    /**
     * pause execution for time t (ms)
     *
     * @param {*} t
     * @memberof Walax
     */
    sleep = t => new Promise(s => setTimeout(s, t))
    
    getCookie(name) {
        let cookieValue = null
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';')
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim()
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                    break
                }
            }
        }
        return cookieValue
    }

    config = new Map()
    /**
     * signal handler for 'setup'
     *
     * @param {*} src
     * @param {*} config
     * @param {*} force
     * @memberof Walax
     */
    setup(src, config, force) {
        if (config) for (let name in config) this.config.set(name, config[name])

        // register plugins
        const plug = {
            log: Logger,
            cache: Cache,
            net: Network,
            obj: Objects,
            auth: Auth,
            test: Test
        }
        d('initializing...')
        for (let name in plug) this.addPlugin(name, plug[name])

        // a(this.plugins.size == Object.keys(plug).size, 'plugin count wrong')

        // should have normal logging by now
        this.log.register(consoleLog)
        this.log.info('setup complete')

    }


    /**
     * load a component control plugin
     *
     * @param {*} cmp
     * @param {boolean} [kee]
     * @param {object} [cmp]
     * @param {*} args
     * @memberof Walax
     */
    addPlugin(key, cmp, ...args) {
        d(`adding plugin`, { key, cmp, args })
        a(this.isSubclassOf(Control, cmp), `${key} must extend walax.control.Control`, cmp)
        let newCmp = new cmp(...args)
        this.plugins ||= new Map()

        if (this.isValidProp(key)) {
            this.plugins.set(key, newCmp)
            this.augment(this, key, () => this.plugins.get(key))
        } else {
            throw new TypeError('invalid component')
        }

        return cmp
    }

    /**
     * check to see if name is a valid property string
     *
     * @param {*} name
     * @return {*}
     * @memberof Walax
     */
    isValidProp(name) {
        if (!name) return false
        if (typeof name != 'string') return false
        if (name.search('[^A-Za-z_]') > -1) return false
        //if (name.search(/[^\w]/) != -1) return false
        return true
    }

    /**
     * check to see if argument is a callable function
     *
     * May pass a single (Function-like) object, or an object and a property name
     *
     * @param {*} args
     * @return {*}
     * @memberof Walax
     */
    callable(...args) {
        let f = (args.length == 2 && args[1] in args[0]) ? args[0][args[1]] : (args.length == 1) ? args[0] : undefined
        return f instanceof Function
    }

    /**
     * add a dynamic property to an object
     *
     * @param {*} obj
     * @param {*} key
     * @param {*} getter
     * @param {*} [setter=undefined]
     * @memberof Walax
     * */
    augment(obj, key, getter, setter = undefined) {
        a(
            obj && key && getter && typeof getter == 'function',
            'augment called improperly',
            { obj },
            { key },
            { getter },
            { setter }
        )
        a(this.isValidProp(key), `invalid key: ${key}`)
        a(!Object.keys(obj).includes(key), `key exists: ${key}`)

        let desc = {
            enumerable: true,
            configurable: false,
            get: getter
        }
        if (setter) desc.set = setter
        d('augment', { obj, key, desc })
        Object.defineProperty(obj, key, desc)
        a(Object.getOwnPropertyNames(obj).includes(key), 'augmentation failed')
        // d('augmented', { obj }, { key }, { desc })
    }

    /**
     * check class inheritance
     *
     * @param {*} req
     * @param {*} cls
     * @return {*}
     * @memberof Walax
     */
    isSubclassOf(req, cls) {
        if (!req || !cls) return false // should prob log something heres
        if (req instanceof cls) return true
        if (cls == req) return true
        return this.isSubclassOf(req, cls.__proto__)
    }
}

export const w = observable.box(new Walax()).get()

if (window && WDEBUG) window.w = w

export default w
