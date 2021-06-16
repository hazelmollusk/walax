import { observable, computed } from 'mobx'
// import { Schema } from '../model/Schema'
import { DjangoSchema } from '../model/django/DjangoSchema'

import Control from './Control'

export default class Objects extends Control {
    schemas = new Map()
    models = new Map()
    managers = new Map()
    constructor() {
        super()
    }

    toString() { return 'Objects'}
    get defaultSchemaClass() {
        return DjangoSchema
    }

    get defaultManagerClass() {
        return true // fixme
    }

    checkManager(manager) {
        return true // not even sure we should check inheritance here
    }

    getManager(model, manager = false) {
        manager ||= model._managerClass
        manager ||= model._schema._defaultManagerClass
        manager ||= this.defaultManagerClass

        this.a(this.checkManager(manager), 'could not find a valid manager class')
        // todo use cache? not sure.
        if (!this.managers.has(model)) this.managers.set(model, new manager(model))

        return this.managers.get(model)
    }

    // get Object (model, pk) {
    //   let obj = w.cache.find(undefined, 'objects', model, pk)
    // }

    receiveObject(model, data) {
        this.d(
            "receving object data",
            data
        )
        //this.checkModels([model])

        let obj = new model(data)

        //Object.assign(obj, data)
        // for (let fname in data) {
        //     obj[fname] = data[fname]
        // }
        obj._w.new = false
        obj._w.dirty.clear()

        this.d(`object created`, {model, obj})

        // k, v, ...cache ident
        //w.cache.store(obj.pk, obj, 'objects', model._schema, model)
        return obj
    }

    checkName(name) {
        // todo generic, move to Walax
        if (!name) throw new TypeError('schema name may not be blank')
        if (this.schemas.has(name))
            throw new TypeError(`schema name ${name} already registered`)
        if (!w.isValidProp(name))
            throw new TypeError(`invalid schema name: ${name}`)
        return true
    }

    checkModels(models) {
        if (!models) return true
        models.forEach((v, k) => {
            if (!w.isValidProp(k)) throw new TypeError(`invalid name for model ${k}`)
            if (!this.checkModel(v))
                throw new TypeError(`custom model ${k} is not a WalaxObject`)
        })
        return true
    }

    checkModel(model) {
        return w.checkClass(WalaxModel, model) // todo maybe
    }

    checkSchema(cls) {
        return true
    }

    toString() {
        return 'Objects'
    }

    async load(name, url, models = false, schemaCls = false) {
        this.d(`${name} | ${url}`)
        this.checkName(name)
        this.checkModels(models)
        schemaCls ||= this.defaultSchemaClass
        this.checkSchema(schemaCls)
        let schema = new schemaCls(name, false, models)
        w.augment(this, name, () => this.schemas.get(name))
        this.schemas.set(name, schema)
        return schema.loadUrl(url)
    }

    schema(name) {
        return this.schemas.get(name)
    }
    initialize(data) { }
}
