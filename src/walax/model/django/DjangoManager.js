import Manager from '../Manager'
import DjangoQuery from './DjangoQuery'
import DjangoModel from './DjangoModel'

export default class DjangoManager extends Manager {
  constructor (model) {
    super(model)
    this.model = model
  }

  get params () {
    return {}
  }

  async all () {
    let query = new DjangoQuery(this)
    return query
  }

  async one (args) {
    let query = new DjangoQuery(this, args, false)
    return query.then(x => {
      this.d('ONE', { query, x })
      x.forEach(y => {
        this.d('returning ONE', y)
        return y
      })
    })
  }

  cached (id) {
    return w.cache.get(`objects/${this.model.name}/${id}`)
  }

  async filter (args) {
    let query = new DjangoQuery(this, args)
    return query
  }

  async exclude (...args) {
    let query = new DjangoQuery(this, args, true)
    return query
  }

  async none () {
    return this.all().none()
  }

  get serialized () {
    return this.model.modelName
  }
}
