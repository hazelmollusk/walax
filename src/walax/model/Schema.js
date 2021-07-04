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
        return this.loadUrl(name, url)
    }

    checkModel(model) {
        if (!w.checkClass(Model, model)) return false
        return true
    }

    initSchema(data) {
        this.a(false, 'initSchema not implemented')
    }

    createModel(name, opts = undefined) {
        const model = this.models?.get?.(name) || this.defaultModel
        
        this.a(model, 'no base model to use')

        this.a(this.checkModel(model), `invalid model registered: ${name}`)
        this.a(!w.obj.models.has(name), `model ${name} already exists!`)
        this.d(`creating model ${name}`, { schema: this, model })
        w.augment(this, name, () => model)
        w.augment(w.obj, name, () => model)
        w.obj.models.set(name, model)
        this.models[name] ||= model

        return model
    }
}
