import w from '../../Walax'
import Entity from '../../util/Entity'

class DjangoQueryProxy extends Entity {
  query = false
  keys = false

  constructor (query) {
    super()
    this.query = query
  }

  [Symbol.iterator] () {
    this.keys = this.query.cache
    return this
  }

  next () {
    let cur = this.keys.next()
    if (cur.done) return cur
    let obj = w.obj.getObject(this.query._model, cur.value)
    return { value: obj, done: false }
  }
}

class DjangoQuery {
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
    this._parent = parent
    this._flip = flip
    this._filter = filter
    this._single = single
  }

  get _model () {
    return this._parent._model
  }

  get serialized () {
    let rec = ''
    for (let f in this._filter) rec += `(${f}=${this._filter[f]})`
    if (this._single) rec = '#' + rec
    if (this._flip) rec = '!' + rec
    rec = `${this._parent.serialized}+[${rec}]`
    return rec
  }

  [Symbol.iterator] () {
    return new DjangoQueryProxy(this.w, this)
  }

  get cached () {
    return w.cache.find(false, 'queries', this.serialized)
  }

  set cached (val) {
    return w.cache.store(val, 'queries', this.serialized)
  }

  get cache () {
    if (!this.cached) this.fetch()
    return this.cached
  }

  fetch () {
    this.d(this, 'fetch')
    let res = new Set()
    return w.net.get(this._model._modelUri).then(data => {
      this.d('qqqqq', data)
      if (data.length)
        data.forEach(o => res.add(w.obj.recieveObject(this._model, o)))
      this.d('res', this._model, res)
      this.cached = res
    })
  }

  all () {
    return new DjangoQuery(this)
  }

  none () {
    return new DjangoQuery(this, false, true)
  }

  filter (args) {
    return new DjangoQuery(this, args)
  }

  exclude (args) {
    return new DjangoQuery(this, args, true)
  }
}

export default DjangoQuery
