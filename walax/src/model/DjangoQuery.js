class DjangoQueryProxy {
  query = false
  keys = false

  constructor (query) {
    this.query = query
  }

  [Symbol.iterator] () {
    this.keys = this.query.cache
  }

  next () {
    let cur = this.keys.next()
    if (cur.done) return cur
    let obj = w.obj.getObject(this.query._model, cur.value)
    return { value: obj, done: false }
  }
}

class DjangoQuery {
  _model = false
  _parent = false
  _flip = false
  _filter = false
  _single = false
  _cache = false

  /**
   * Creates an instance of DjangoQuery.
   * @param {*} model
   * @param {*} parent
   * @param {dict} [args=false]
   * @param {boolean} [flip=false]
   * @memberof DjangoQuery
   */
  constructor (parent, filter = false, flip = false, single = false) {
    // todo: sanity check
    this._model = parent._model
    this._parent = parent
    this._flip = flip
    this._filter = filter
    this._single = single
  }

  get serialized () {
    return this // FIXME SHOULD BE STRING OF ALL PARENTS TO MANAGER
  }

  [Symbol.iterator] () {
    return new DjangoQueryProxy(this)
  }

  get cache () {
    this._cache ||= w.cache.find(s => this.fetch(), 'queries', this.serialized)
    return this._cache
  }

  fetch () {
    return new Set()
  }

  all () {
    return new DjangoQuery(this)
  }

  none () {
    return new DjangoQuery(this, false, true)
  }

  filter (...args) {
    return new DjangoQuery(this, args)
  }

  exclude (...args) {
    return new DjangoQuery(this, args, true)
  }
}

export default DjangoQuery
