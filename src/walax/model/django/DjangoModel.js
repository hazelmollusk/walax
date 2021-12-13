import Model from '../Model'
import DjangoManager from './DjangoManager'
import w from '../../Walax'

/**
 * DjangoModel
 * @class
 */
export default class DjangoModel extends Model {
  static defaultManager = DjangoManager

  /**
   * builds a new DjangoModel
   * @class
   * @classdesc a WalaxModel backed by Django Rest Framework
   * @param {*} data
   */
  constructor (data) {
    super()
    this._setFieldDefaults()
    if (data) this.updateFields(data)
  }

  toString () {
    let parts = ['django', this._meta.model.modelName]
    if (this.pk) parts.concat(this.pk)
    return parts.join('.')
  }

  _getField (fn) {
    // this.d('getting field', fn)
    let fv = this._meta.values.get(fn),
      fd = this._meta.model.fields[fn]

    if (fd.type == 'choice') {
      fd.choices.forEach(f => {
        if (f.value == fv) {
          fv = f.display_name
        }
      })
    }

    return fv
  }

  _setField (fn, val) {
    let fd = this._meta.model.fields[fn]
    // this.d(`setField(${fn})`, val, fd)
    let fv = val
    this.a(fd, `field ${fn} not found`)
    this.a(!fd?.read_only, `field ${fn} is read-only`)
    switch (fd.type) {
      case 'field':
        break
      case 'string':
        this.a(typeof fv == 'string', `field ${fn} is a string`, fv)
        if (fd.max_length)
          this.a(fv.length <= fd.max_length, 'string is too long')
        break
      case 'choice':
        let fc = undefined
        fd.choices.forEach(f => {
          if (
            [f.value, f.display_name].includes(val) ||
            f.display_name.toLowerCase() == String(val).toLowerCase()
          )
            fc = f.value
        })
        this.a(fc !== undefined, `invalid choice for field ${fn}`, fd, fv)
        fv = fc
        break
    }
    this._meta.dirty.add(fn)
    this._meta.values.set(fn, fv)
    this.d('field set', fn, fv)
    return fv
  }

  //fixme for types
  _setFieldDefaults () {
    for (let fn in this._meta.model.fields) this._meta.values.set(fn, undefined)
  }

  _validateFields () {
    return true
  }

  updateFields (data, wasNew = false) {
    this.d('updateFields', data, this)
    for (let fn in data) {
      this.a(
        Object.keys(this._meta.model.fields).includes(fn),
        `key ${fn} not found`,
        this._meta.model
      )
      this._meta.values.set(fn, data[fn])
      // not sure this should ever happen
      // if (this._meta.new) {
      //   this._meta.dirty.add(fn)
      // }
    }
    if (data && data.url) this._meta.url = data.url
    if (!this._meta.url && this.pk)
      this._meta.url = [this._meta.model.modelUrl, this.pk, '/'].join('')
    //TODO support non-trailing slash urls?
  }

  async save () {
    // if (!this._meta.dirty.size) {
    //   this.d('save(): object unchanged, not saving')
    //   return this
    // }
    this.a(
      !this._meta.deleted,
      `saving deleted model: ${this.toString()}.save()`
    )
    this.a(this._validateFields(), 'fields failed to validate')
    let saveFields = Object.fromEntries(this._meta.values.entries())
    for (let fn in saveFields)
      if (saveFields[fn] === undefined) delete saveFields[fn]

    this.d('saving object', { obj: this, saveFields })
    try {
      if (this._meta.new) {
        return w.net
          .post(this._meta.model.modelUrl, {}, saveFields, {})
          .then(ret => {
            this.updateFields(ret)
            return w.obj.cache.get(
              `objects/${this.name}/${ret[this._meta.model.pk]}`,
              () => this
            )
          })
      } else {
        // ERROR CHECKING FOOL
        return w.net.put(this.url, {}, saveFields, {}).then(ret => {
          this.updateFields(ret)
        })
      }
    } catch (err) {
      this.d('error saving object')
      this.e(err)
    }
  }

  async delete () {
    console.log('this', this)
    this.d('deleting', this)
    this.a(
      !this._meta.deleted,
      `deleting deleted model: ${this._name}.delete()`
    )
    return w.net.delete(this.url).then(ret => {
      this.d('deleted', { obj: this })
      this._meta.deleted = true
      this._meta.values.clear()
    })
  }
}
