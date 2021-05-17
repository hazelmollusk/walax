import 'regenerator-runtime/runtime' // i guess
import { Logger, consoleLog } from './control/Logger'
import Entity from './util/Entity'
import Control from './control/Control'
import Objects from './control/Objects'
import Network from './control/Network'
import Auth from './control/Auth'
import Cache from './control/Cache'
import View from './control/View'
import Test from './control/Test'
import Schema from './model/Schema'
import Model from './model/Model'
import Manager from './model/Manager'

const { observable } = require('mobx')

// need our own debug/asserts bc log plugin
// might not be there during instantiation of the
// walax object

// todo console logging themes (for applications)
const DEBUG = true
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
const d = DEBUG
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
const _d_a = DEBUG
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
 * @extends {Entity}
 */
class Walax extends Entity {
    constructor(...args) {
        super()
    }

    /**
     * load a named API from url
     *
     * @param {*} url
     * @param {*} key
     * @return {*} 
     * @memberof Walax
     */
    load(url, key) {
        this.net.load(url)
        this.obj.load(url, key)
        this.auth.load(url) // FIXME?
        

        d(`setting apiBase to ${this.apiBase}`)
        return true
    }

    toString() {
        return 'WALAX'
    }

    /**
     * initialize Walax object for use
     *
     * @param {*} sig
     * @memberof Walax
     */
    initialize(...sig) {
        this.signal('init', ...sig)
    }

    /**
     * pause execution for time t (ms)
     *
     * @param {*} t
     * @memberof Walax
     */
    sleep = t => new Promise(s => setTimeout(s, t))

    /**
     * signal handler for 'setup'
     *
     * @param {*} src
     * @param {*} config
     * @param {*} force
     * @memberof Walax
     */
    setup(src, config, force) {
        this.augmentObj(this, 'config', new Map())
        if (config) for (let name in config) this.config.set(name, config[name])

        // register plugins
        const plug = {
            log: Logger,
            cache: Cache,
            net: Network,
            obj: Objects,
            auth: Auth,
            view: View,
            test: Test
        }
        d('initializing...')
        for (let name in plug) this.addPlugin(plug[name], name)

        // a(this._plugins.size == Object.keys(plug).size, 'plugin count wrong')

        // should have normal logging by now
        this.log.register(consoleLog)
        this.log.info('setup complete')

    }

    /**
     * load a component control plugin 
     *
     * @param {*} cmp
     * @param {boolean} [key=false]
     * @param {*} args
     * @memberof Walax
     */
    addPlugin(cmp, key = false, ...args) {
        a(this.checkClass(Control, cmp), `${key} must extend walax.control.Control`, cmp)
        this.addComponent(cmp, key, ...args)
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
     * augment an object with a static value
     *
     * @param {*} obj
     * @param {*} key
     * @param {*} prop
     * @memberof Walax
     */
    augmentObj(obj, key, prop) {
        obj._walaxAugmentations ||= new Map()
        obj._walaxAugmentations.set(key, prop)
        this.augment(obj, key, () => obj._walaxAugmentations.get(key))
    }

    // FIXME
    augmentDynamic(...args) {
        try {
            let obj = args.shift()
            let key = args.shift()
            let getter, setter
            if (args.length) {
                setter = args.shift()
                this.a(this.callable(getter), 'bad property getter')
                if (args.length) {
                    setter = args.shift()
                    this.a(this.callable(setter), 'bad property setter')
                }
            }
            this.augment(obj, key, () => { return obj._walaxAugmentations.get(key) })

        } catch (e) {
            this.e('augmentDynamic', e)
        }
    }

    /**
     * add a dynamic property to an object
     *
     * @param {*} obj
     * @param {*} key
     * @param {*} getter
     * @param {*} [setter=undefined]
     * @memberof Walax
     */
    augment(obj, key, getter, setter = undefined) {
        a(
            obj && key && getter,
            'augment called improperly',
            { obj },
            { key },
            { getter }
        )
        a(this.isValidProp(key), `invalid key: ${key}`)
        a(!Object.keys(obj).includes(key), `key exists: ${key}`)
        a(
            typeof getter == 'function',
            'getter must be a function',
            { obj },
            { key },
            { getter }
        )
        let desc = {
            enumerable: true,
            configurable: false,
            get: getter
        }
        if (setter) desc.set = setter
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
    checkClass(req, cls) {
        if (!req || !cls) return false // should prob log something heres
        if (req instanceof cls) return true
        if (!cls || !req) return false
        if (cls == req) return true
        return this.checkClass(req, cls.__proto__)
    }

    addClass(name, cls) {
        Object.defineValue(this._walaxAugmentations.get('classes'), name, {value: cls})
    }
}

export const ww = new Walax()
ww.augmentObj(ww, 'classes', {
    Entity,
    Schema,
    Model,
    Manager,
    Control
})

export const w = observable.box(ww).get()
if (window) window.w = w
export default { w }