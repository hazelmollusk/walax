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
    let obj = w.obj.getObject(this.query.model, cur.value)
    return { value: obj, done: false }
  }
}

class DjangoQuery extends Entity {
  parent = false
  flip = false
  filter = false
  single = false
  cache = false

  /**
   * Creates an instance of DjangoQuery.
   * @param {*} model
   * @param {*} parent
   * @param {dict} [args=false]
   * @param {boolean} [flip=false]
   * @memberof DjangoQuery
   */
  constructor (
    parent,
    args = false,
    flip = false,
    single = false,
    order,
    limit,
    offset
  ) {
    // todo: sanity check
    super()
    this.parent = parent
    this.flip = flip
    this.args = args
    this.single = single
    this.cache = {}
  }

  toString () {
    return 'DjangoQuery ' + this.serialized
  }

  all () {
    return new DjangoQuery(this)
  }

  filter (args) {
    return new DjangoQuery(this, args)
  }

  exclude (args) {
    return new DjangoQuery(this, args, true)
  }

  one (args) {
    return new DjangoQuery(this, args, false, true)
  }

  get model () {
    return this.parent.model
  }

  get params () {
    let p = this.parent.args ? this.parent.args : {}
    if (this.args) Object.assign(p, this.args)
    this.d('query params', p)
    return p
  }

  get serialized () {
    let rec = ''
    for (let f in this.args) rec += `(${f}=${this.args[f]})`
    if (this.single) rec = '#' + rec
    if (this.flip) rec = '!' + rec
    rec = `${this.parent.serialized}` + (rec ? `+${rec}` : '')
    return rec
  }

  [Symbol.iterator] () {
    return new DjangoQueryProxy(this)
  }

  async fetch () {
    let res = new Set()
    this.d('query fetch', this.model, this.params)
    return w.net.get(this.model.modelUrl, this.params).then(data => {
      if (data.length) {
        this.d('received query data', data)
        data.forEach(o => {
          let newObj = w.obj.receiveObject(this.model, o)
          this.d('object created', newObj)
          if (this.single) return newObj
          res.add(newObj)
        })
      }

      this.d('fetch returns', res)
      return res
    })
  }

  async then (f) {
    return this.fetch().then(res => f(res))
  }
}

export default DjangoQuery
