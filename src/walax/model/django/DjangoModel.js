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
    constructor(data) {
        super()
        this._setFieldDefaults()
        if (data) this.updateFields(data)
    }

    toString() {
        return ['django', this._w.model.modelName, this.pk].join('.')
    }

    _getField(fn) {
        // this.d('getting field', fn)
        return () => {
            let fv = this._w.values.get(fn),
                fd = this._w.model.fields[fn]

            if (fd.type == 'choice') {
                fd.choices.forEach(f => {
                    if (f.value == fv) {
                        fv = f.display_name
                    }
                })
            }

            return fv
        }
    }

    _setField(fn) {
        return val => {
            let fd = this._w.model.fields[fn]
            // this.d(`setField(${fn})`, val, fd)
            let fv = val
            this.a(fd, `field ${fn} not found`)
            this.a(!fd?.read_only, `field ${fn} is read-only`)
            switch (fd.type) {
                case 'field':
                    break
                case 'string':
                    this.a(typeof fv == 'string', `field ${fn} is a string`, fv)
                    if (fd.max_length) this.a(fv.length <= fd.max_length, 'string is too long')
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
            this._w.dirty.add(fn)
            this._w.values.set(fn, fv)
            this.d('field set', fn, fv)
            return fv
        }
    }

    //fixme for types
    _setFieldDefaults() { 
        for (let fn in this._w.model.fields)
            this._w.values.set(fn, undefined)
    }

    _validateFields() {
        return true
    }

    updateFields(data, wasNew = false) {
        this.d('updateFields', data)
        for (let fn in data) {
            this.a(Object.keys(this._w.model.fields).includes(fn))
            this._w.values.set(fn, data[fn])
        }
        if (data && data.url) 
            this._w.url = data.url 
        if (!this._w.url && this.pk) 
            this._w.url = [this._w.model.modelUrl, this.pk, '/'].join('')
            //TODO support non-trailing slash urls?
        if (this._w.new) {
            this._w.new = false
            this._w.dirty.clear()
        }
    }

    async save() {
        if (!this._w.dirty.size) {
            this.d('save(): object unchanged, not saving')
            return this
        }
        this.a(!this._w.deleted, `saving deleted model: ${this.toString()}.save()`)
        this.a(this._validateFields(), 'fields failed to validate')
        let saveFields = Object.fromEntries(this._w.values.entries())
        if (this._w.new) {
            return w.net.post(this._w.model.modelUrl, {}, saveFields, {}).then(ret => {
                this.updateFields(ret)
            })
        } else {
            // ERROR CHECKING FOOL
            return w.net
                .put(this.url, {}, saveFields, {})
                .then(ret => this.updateFields(ret))
        }
    }

    async delete() {
        this.a(!this._w.deleted, `deleting deleted model: ${this._name}.delete()`)
        return w.net.delete(this.url).then(ret => {
            this.d('deleted', { obj: this })
            this._w.deleted = true
            this._w.values.clear()
        })
    }
}
