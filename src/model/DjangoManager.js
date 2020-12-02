import WalaxManager from './WalaxManager'
import DjangoQuery from './DjangoQuery'

export default class DjangoManager extends WalaxManager {
  constructor (w, model) {
    super(w, model)
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

  getPk (pk) {}

  get serialized () {
    return `{${this._model._name}}`
  }
}
