import { observable } from 'mobx'
import Model from './Model'
import Manager from './Manager'
import w from '../Walax'
import Entity from '../util/Entity'

//todo schema versioning/collision detection/etc
export default class Schema extends Entity {
    schema = false
    title = false
    description = false
    version = false
    name = false
    uri = false
    servers = false
    defaultManager = Manager
    managers = new Map()
    models = new Map()

    constructor(name, url, models = false) {
        super(url)
        this.a(name || !url, `need a name for schema ${url}`)
        this._name = name
        this._models = models
        this.d(` Django schema ${name} (${url}) loaded`)
        if (url) this.load(name, url, models)
    }

    initialize() {
        this.schema = false
        this.title = false
        this.description = false
        this.version = false
        this.url = false
        this.servers = false
        this.models.clear()
    }

    loadUrl(url) {
        this.e('schema class must implement loadUrl')
    }

    load(name, url, models = false, servers = false) {
        //let url = new URL(url) // this will throw a TypeError if invalid
        this.initialize()
        this.d(`${name}: ${url}`)
        models ||= this.models
        this.models ||= models
        models?.forEach?.((v) => this.addModel(v, models[v]))
        this.url = url
        this.servers = servers
        return this.loadUrl(url)
    }

    // TODO may need an updateModel() if PUT and POST differ (so fields changes)
    addModel(name, model) {
        this.a(this.checkModel(model), `invalid model registered: ${name}`)
        this.d(`adding model ${name}`, { schema: this, model })
        w.augment(this, name, () => model)
        w.augment(w.obj, name, () => model)
        this.models.set(name, model)
    }

    checkModel(model) {
        if (!w.checkClass(Model, model)) return false
        return true
    }

    initSchema(data) {
        this.a(false, 'initSchema not implemented')
    }

    createModel(name, opts = undefined) {
        const schemaObject = this
        const BaseModel = this.models?.get?.(name) || this._defaultModel
        opts ||= {}

        this.d('createModel', { name }, { opts }, { schemaObject }, { BaseModel })
        opts ||= {}
        this.d(`creating model class for ${name}`, { BaseModel }, { opts })

        class walaxifiedModel extends BaseModel {

            constructor(data = false) {
                super(data)
                this._initModel(data)
                this.d('built an object', { obj: this }, { data })
            }

            _initModel(data) {
                let s = schemaObject,
                    n = name

                this._w = {
                    dirty: new Set(),
                    values: new Map(),
                    url: false,
                    new: true,
                    schema: s,
                    values: new Map(),
                    model: this.__proto__,
                    get fields() { return s.fields[n] }
                }
                this.d('initmodel', this)
                if (Object.keys(this._w.fields).length) {
                    this.d(`adding fields ${n}`)
                    Object.keys(this._w.fields).forEach(fn => {
                        this.d(`field ${fn}`)
                        w.augment(
                            this,
                            fn,
                            this._walaxGetField(fn),
                            this._walaxSetField(fn)
                        )
                        //FIXME at the very least per-type
                        
                        this._setFieldDefault(fn)
                    })
                    if (data) {
                        this.d('assigning data', this, data)
                        //Object.assign(this, data)
                        // for (let fn in data) {
                        //     this.d('field', fn, data[fn])
                        //     this[fn] = data[fn]
                        // }
                        this.d('assigned', this)
                    }
                }
            }

            _validateFields() {
                return true
            }

            _setFieldDefault(field) {
                if (field == 'url') return true
                this._w.values[field] = undefined

                let fd = this._w.fields[field]
                switch (fd.type) {
                }
                return true
            }

            _walaxGetField(field) {
                if (this._getField) return this._getField(field)
                return () => this._w.values.get(field)
            }

            _walaxSetField(field) {
                // if (this._setField) return this._setField(field)
                return val => {
                    let newVal = val
                    this._w.dirty.add(field)
                    this._w.values.set(field, newVal)
                    return newVal
                }
            }

            toString() {
                return `${name} object`
            }
        }
        walaxifiedModel.fields = opts.fields || {}
        walaxifiedModel.url = opts.url || ''
        
        
        this.d(`adding model ${name}`, walaxifiedModel.fields)
        this.addModel(name, walaxifiedModel)
        return walaxifiedModel
    }
}
