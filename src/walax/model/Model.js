import Manager from './Manager'
import Entity from '../util/Entity'
import w from '../Walax'

export default class Model extends Entity {
  static defaultManager = Manager

  constructor (data) {
    super()
    this._meta = {
      model: this.constructor,
      values: new Map(),
      dirty: new Set()
    }
    this._initModel(data)
  }

  static get objects () {
    //fixme one manager per manager/model tuple
    this.manager ||= new this.defaultManager(this)
    return this.manager
  }

  static get fields () {
    return this._meta.fields
  }

  static get fields () {
    return this._meta.fields
  }

  get pk () {
    return this[this._meta.model.pk]
  }

  get url () {
    return this._meta.url
  }

  set url (u) {
    this._meta.url = u
  }

  save () {
    this.a(false, 'model class must implement save()')
  }

  delete () {
    this.a(false, 'model class must implement delete()')
  }

  _initModel (data) {
    this._meta ||= {}
    Object.assign(this._meta, {
      dirty: new Set(),
      values: new Map(),
      url: false,
      new: true,
      values: new Map()
    })
    this.d('initmodel', this)
    if (Object.keys(this._meta.model.fields).length) {
      Object.keys(this._meta.model.fields).forEach(fn => {
        this.d(`field ${fn}`)
        // w.augment(this, fn, this._walaxGetField(fn), this._walaxSetField(fn))
        //FIXME at the very least per-type

        this._setFieldDefault(fn)
      })
      if (this._meta.model.relatedQueries) {
        Object.keys(this._meta.model.relatedQueries).forEach(rn => {
          w.augment(this, rn, () => this._meta.model.relatedQueries[rn])
        })
      }
      if (data) {
        for (let fn in data) {
          this.d('setting field', fn, data[fn])
          if (fn == 'url') {
            this._meta.url = data[fn]
          } else {
            this._meta.values.set(fn, data[fn])
          }
        }
      }
    }
  }

  _validateFields () {
    this.a(false, 'not implemented')
  }

  // _getField(fn) {
  //     this.a(false, 'not implemented')
  // }

  // _setField(fn) {
  //     this.a(false, 'not implemented')
  // }

  _setFieldDefault (field) {
    if (field == 'url') return true
    this._meta.values.set(field, undefined)

    let fd = this._meta.model.fields[field]
    switch (fd.type) {
    }
    return true
  }

  _getField (field) {
    this._meta.values.get(field)
  }

  _setField (field) {
    this._meta.dirty.add(field)
    this._meta.values.set(field, val)
    return newVal
  }

  toString () {
    return `object`
  }
}
