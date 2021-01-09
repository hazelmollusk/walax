import Manager from '../Manager'
import DjangoQuery from './DjangoQuery'

export default class DjangoManager extends Manager {
  constructor (model) {
    super(model)
  }

  all () {
    return new DjangoQuery(this)
  }

  filter (args) {
    return this.all().filter(args)
  }

  exclude (...args) {
    return this.all().exclude(args)
  }

  none () {
    return this.all().none()
  }

  get serialized () {
    return `{${this._model._name}}`
  }
}
