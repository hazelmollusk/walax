import Model from '../Model'
import DjangoManager from './DjangoManager'
import w from '../../Walax'

/**
 * DjangoModel
 * @class
 */
export default class DjangoModel extends Model {
    /**
     * builds a new DjangoModel
     * @class
     * @classdesc a WalaxModel backed by Django Rest Framework
     * @param {*} data
     */
    constructor(data) {
        super(data)
    }

    static _w = {
        defaultManager: DjangoManager
    }

    _getField(fn) {
        return () => {
            let fv = this._w.values.get(fn),
                fd = this._w.fields[fn]

            if (fd.type == 'choice') {
                fd.choices.forEach(c => {
                    if (f.value == val) {
                        fv = f.display_name
                        fv.choices = fd.choices
                    }
                })
            }

            return fv
        }
    }

    _setField(fn) {
        return val => {
            let fd = this._w.fields[fn]
            this.d(`setField(${fn})`, val, fd)
            let fv = val
            this.a(fd, `field ${fn} not found`)
            this.a(!fd?.read_only, `field ${fn} is read-only`)
            switch (fd.type) {
                case 'field':
                    break
                case 'string':
                    // this.a(typeof fv == 'string', `field ${fn} is a string`, fv)
                    // if (fd.max_length) this.a(fv.length <= fd.max_length)
                    break
                case 'choice':
                    let fc = undefined
                    fd?.choices.forEach(c => {
                        if (
                            [fv, v.display_name].includes(val) ||
                            fc.toLowerCase() == fv.toLowerCase()
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
            return val
        }
    }

    _setFieldDefault(fn) { }

    _validateFields() {
        return true
    }

    updateFields(data, wasNew = false) {
        this.d('updateFields', data)
        Object.assign(this, data)
        if (this._w.new) {
            this._w.url = data.url || '/'.join(this._w.model.url, this.pk)
            this._w.new = false
            this._w.dirty.clear()
        }
    }

    save() {
        if (!this._w.dirty.size) {
            this.d('save(): object unchanged, not saving')
            return this
        }
        this.a(!this._w.deleted, `saving deleted model: ${this.toString()}.save()`)
        this.a(this._validateFields(), 'fields failed to validate')
        let saveFields = Object.fromEntries(this._w.values.entries())
        if (this._w.new) {
            w.net.post(this._w.model.url, {}, saveFields, {}).then(ret => {
                this.updateFields(ret)
            })
        } else {
            // ERROR CHECKING FOOL
            w.net
                .put(this._w.url, {}, saveFields, {})
                .then(ret => this.updateFields(ret))
        }
        return this
    }

    delete() {
        this.a(!this._deleted, `deleting deleted model: ${this._name}.delete()`)
        w.net.delete(this._walaxUrl).then(ret => {
            this.d('deleted', { obj: this })
            this._deleted = true
            this._w.values.clear()
        })
    }
}
