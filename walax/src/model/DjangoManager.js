import WalaxManager from './WalaxManager'
import DjangoQuery from './DjangoQuery'

export default class DjangoManager extends WalaxManager {
  constructor(model) {
    super(model)
  }

  all() {
    return new DjangoQuery(model, this)
  }

  filter(...args) {
    return this.all().filter(...args)
  }

  exclude(...args) {
    return this.all().exclude(...args)
  }

  none() {
    return this.all().none()
  }

  get(pk) {

  }
}