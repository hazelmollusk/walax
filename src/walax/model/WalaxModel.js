import WalaxManager from './WalaxManager'
import WalaxEntity from '../util/WalaxEntity'
import w from '../Walax'

export default class WalaxModel extends WalaxEntity {
  constructor (data = false) {
    super()
  }

  initialize (data) {
    super.initialize(data)
  }

  static get manager () {
    return this._walaxModel.manager
  }

  static get objects () {
    return this.manager
  }

  save () {
    this.a(false, 'model class must implement save()')
  }

  delete () {
    this.a(false, 'model class must implement delete()')
  }
}
