var m = require('mithril')
import Model from './Model'
var { observable } = require('mobx')

class Manager {
  static instances = observable(new Map())
  _xin = 1

  static instance (model) {
    if (!this.instances.has(model))
      cObject.register(this.instances.set(model, new this(model)).get(model))
    return this.instances.get(model)
  }

  constructor (model) {
    this._name = 'base'
    this._def = '_all'
    this.apiSlug = ''
    this.model = model
    this.cached = new Map()
    this.tagged = new Map()
  }

  xin (remote = false) {
    return this._xin++ * (remote ? -1 : 1)
  }

  tags (tag = false, fetch = false) {
    if (fetch) this._fetchObjects(tag)

    return this._tag(tag)
  }

  tag (tag, obj) {
    var t = this
    if (!tag || !obj) return
    if (!Array.isArray(tag)) tag = [tag]
    if (Array.isArray(obj._tag)) tag += obj._tag
    tag.map(tg => t._tag(tg).add(obj))
    return obj
  }

  cacheObject (obj, tag = false) {
    this.cached.set(obj.xin, obj)
    this.tag(tag, obj)
    return this.cached.get(obj.xin)
  }

  create (obj, tag = false, remote = false) {
    obj['_remote'] = remote
    obj['_local'] = !remote
    if (!obj['xin']) obj['xin'] = this.xin(remote)
    return this.cacheObject(new this.model(obj), tag)
  }

  async fetch (xin) {
    var t = this
    return this.cached.has(xin)
      ? this.cached.get(xin)
      : h
          .get(`api/${this.apiSlug}/:xin`, { xin: xin })
          .then(obj => t.create(obj, (remote = true)))
  }

  objects (tag = false, fetch = false) {
    var t = this
    if (fetch) this._fetchObjects(tag)

    var ret = []
    this._tag(tag).forEach((c, k) => {
      ret.push(c)
    })

    return ret
  }

  _getTag (tag) {
    return ['', false, 'false', undefined].includes(tag) ? this._def : tag
  }

  _tag (tag) {
    tag = this._getTag(tag)
    if (!this.tagged.has(tag)) this.tagged.set(tag, new Set())
    return this.tagged.get(tag)
  }

  async _fetchObjects (tag = false) {
    var t = this

    this._tag(tag).clear()

    var urlTag = [false, 'false', this._def].includes(tag) ? '' : tag

    var ret = h.get(`api/${t.apiSlug}/${urlTag}`).then(obj => {
      t.create(obj, tag, true)
    })

    return this._tag(tag)
  }
}

export default mBase
