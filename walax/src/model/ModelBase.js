class ModelBase extends Object {

  static get _manager () {
    return false
  }

  static get objects () {
    return this._manager?.instance(this)
  }

  static get _fields () {
    return ['xin']
  }
}

export default ModelBase
