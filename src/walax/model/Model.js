import Manager from './Manager'
import Entity from '../util/Entity'
import w from '../Walax'

export default class Model extends Entity {
  constructor () {
    super()
  }

  // initialize (data) {
  //   super.initialize(data)
  // }

  static get manager () {
    return this._getManager(this)
  }

  static get objects () {
    return this._getManager(this)
  }

  static _walaxManager = false
  static _walaxDefaultManager = Manager
  static _getManager (obj) {
    this._walaxManager ||= this._walaxDefaultManager.getForModel(obj)
    return this._walaxManager
  }

  save () {
    this.a(false, 'model class must implement save()')
  }

  delete () {
    this.a(false, 'model class must implement delete()')
  }
}
