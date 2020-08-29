import { observable, computed } from 'mobx'
import { WalaxSchema } from '../model/WalaxSchema'
import { DjangoSchema } from '../model/DjangoSchema'
import w from '../Walax'

export const Objects = {
  schemas: observable.map(),
  models: observable.map(),
  managers: observable.map(),

  loadSchema (schema, name) {
    // pre-built WalaxSchema
    // ,todo checking, implement
    if (this.checkName(name)) {
      w.augment(this, name, { value: schema })
      this.schemas.set(name, schema)
    } else {
      throw new TypeError(`invalid name: ${name}`)
    }
  },

  getManager (mgr, model) {
    if (!this.managers.has(model)) this.managers.set(model, new mgr(model))
    return this.managers.get(model)
  },

  checkName (name) {
    if (!name) throw new TypeError('schema name may not be blank')
    if (this.schemas.has(name))
      throw new TypeError(`schema name ${name} already registered`)
    if (!w.isValidProp(name))
      throw new TypeError(`invalid schema name: ${name}`)
    return true
  },

  checkModels (models) {
    if (!models) return true
    models.forEach((v, k) => {
      if (!w.isValidProp(k)) throw new TypeError(`invalid name for model ${k}`)
      if (!this.checkModel(v))
        throw new TypeError(`custom model ${k} is not a WalaxObject`)
    })
    return true
  },

  checkModel (model) {
    return true // washme
  },

  load (uri, name, models = false) {
    this.checkName(name)
    this.checkModels(models)
    let schema = new DjangoSchema(uri, models) //todo genericify
    this.loadSchema(schema, name)
  },

  schema (name) {
    return this.schemas.get(name)
  }
}

export default Objects
