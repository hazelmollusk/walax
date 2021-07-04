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
    url = false
    defaultManager = Manager
    defaultModel = Model
    managers = new Map()
    models = new Map()

    constructor(name, url, models = {}) {
        super()
        this.a(name || !url, `need a name for schema ${url}`)
        this.name = name
        this.d(` Django schema ${name} (${url}) loaded`)
        this.initialize(models)
        if (url) this.load(name, url, models)
    }

    initialize(models = {}) {
        this.schema = false
        this.title = false
        this.description = false
        this.version = false
        this.url = false
        this.servers = false
        this.models = {}
    }

    importModels(models) {
        // TODO: this
    }

    loadUrl(url) {
        this.e('schema class must implement loadUrl')
    }

    load(name, url, models = {}, servers = false) {
        //let url = new URL(url) // this will throw a TypeError if invalid
        this.initialize(models)
        this.d(`${name}: ${url}`)
        models ||= this.models
        this.models ||= models
        models?.forEach?.(v => this.addModel(v, models[v]))
        this.url = url
        this.servers = servers
        return this.loadUrl(url)
    }

    checkModel(model) {
        if (!w.checkClass(Model, model)) return false
        return true
    }

    initSchema(data) {
        this.a(false, 'initSchema not implemented')
    }

    createModel(name, opts = undefined) {
        const baseModel = this.models?.get?.(name) || this.defaultModel
        
        this.a(baseModel, 'no base model to use')
        class WalaxModel extends baseModel {
            static _wPlaceholder = true
        }
        this.a(this.checkModel(WalaxModel), `invalid model registered: ${name}`)
        this.a(!w.obj.models.has(name), `model ${name} already exists!`)
        this.d(`creating model ${name}`, { schema: this, model: WalaxModel })
        
        WalaxModel._w ||= {}
        if (opts) for (let opt in opts) WalaxModel._w[opt] = opts[opt]
        
        w.augment(this, name, () => WalaxModel)
        w.augment(w.obj, name, () => WalaxModel)
        w.obj.models.set(name, WalaxModel)
        this.models[name] ||= WalaxModel

        this.d('created model', WalaxModel)
        return WalaxModel
    }
}
