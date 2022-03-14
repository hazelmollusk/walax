import { observable, computed } from 'mobx'
// import { Schema } from '../model/Schema'
import { DjangoSchema } from '../model/django/DjangoSchema'
import Model from '../model/Model'
import Control from './Control'

export default class Objects extends Control {
  schemas = new Map()
  models = new Map()
  managers = new Map()
  constructor () {
    super()
  }

  toString () {
    return 'Objects'
  }
  getPropName () {
    return 'obj'
  }
  get defaultSchemaClass () {
    return DjangoSchema
  }

  checkManager (manager) {
    return true // not even sure we should check inheritance here
  }

  receiveObject (model, data) {
    this.d('receiving model object data', model, data)
    this.checkModel(model)
    if (!data) {
      this.d('')
    }
    let obj
    if (data) {
      let key = `objects/${model.name}/${data[model.pk]}`
      obj = w.cache.get(key, () => {
        return new model()
      })

      obj.updateFields(data)
      console.log('refresh')
      if (obj.pk) obj._meta.new = false
      // obj._meta.dirty.clear()
    } else {
      obj = new model()
    }
    this.d(`object created`, { model, obj })

    // k, v, ...cache ident
    //w.cache.store(obj.pk, obj, 'objects', model._schema, model)
    return obj
  }

  checkName (name) {
    // todo generic, move to Walax
    if (!name) throw new TypeError('schema name may not be blank')
    if (this.schemas.has(name))
      throw new TypeError(`schema name ${name} already registered`)
    if (!w.isValidProp(name))
      throw new TypeError(`invalid schema name: ${name}`)
    return true
  }

  checkModels (models) {
    if (!models) return true
    models.forEach((v, k) => {
      if (!w.isValidProp(k)) throw new TypeError(`invalid name for model ${k}`)
      if (!this.checkModel(v))
        throw new TypeError(`custom model ${k} is not a WalaxObject`)
    })
    return true
  }

  checkModel (model) {
    return w.isSubclassOf(Model, model) // todo maybe
  }

  checkSchema (cls) {
    return true
  }

  toString () {
    return 'Objects'
  }

  async load (name, url, models = false, schemaCls = false) {
    this.checkName(name)
    this.checkModels(models)
    schemaCls ||= this.defaultSchemaClass
    this.checkSchema(schemaCls)
    this.apiBase = url
    this.d('loading schema class', url, schemaCls)
    let schema = new schemaCls(name, url, models)
    w.augment(this, name, () => this.schemas.get(name))
    this.schemas.set(name, schema)
    return schema
  }

  schema (name) {
    return this.schemas.get(name)
  }
}
