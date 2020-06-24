class Walax extends Object {
  static get _manager () {
    return false
  }

  static get objects () {
    if (this._manager) 
      return this._manager.instance(this)
  }

  static get _fields () {
    return ['xin']
  }

  static buildObject (obj) {
    var o = new this(true)

    if (obj && (obj['_remote'] || obj['_local'])) {
      for (var f in this._fields) {
        Object.defineProperty(o, f, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: obj[f]
        })
      }
    } else {
      console.debug('PANIC')
      console.debug(obj)
      throw 'really not'
    }
  }

  constructor (really = false) {
    if (!really) throw 'not really'
  }
}

export default ModelBase
