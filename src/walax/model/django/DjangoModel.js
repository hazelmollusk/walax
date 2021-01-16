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

    static _walaxDefaultManager = DjangoManager

    initialize(data = false) {
        super.initializel(data)
    }

    // fixme this is hacky
    get url() {
        return this._w.url
    }
    set url(v) {
        if ('url' in this._w.fields) this._w.values = v
        this._w.url = v
        // maybe call setfield iff...
    }

    _getField(fn) {
        return () => {
            let fv = this._w.values.get(fn),
                fd = this._w.fields[fn]

            // todo
            if (fd.type == 'choice' && !this._w.choiceKeys) {
            }

            return fv
        }
    }

    _setField(fn) {
        return val => {
            this.d(`setField(${fn})`, val)
            let fd = this._w.fields[fn],
                fv = val
            this.assert(fd, `field ${fn} not found`)
            this.assert(!fd.read_only, `field ${fn} is read-only`)
            switch (fd.type) {
                case 'field':
                    break
                case 'string':
                    this.a(typeof fv == 'string', `field ${fn} is a string`, fv)
                    if (fd.max_length) this.a(fv.length <= fd.max_length)
                    break
                case 'choice':
                    let fc = undefined
                    fd.choices.forEach(c => {
                        if (
                            [f.value, v.display_name].includes(val) ||
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
            this._w.url = data.url || '/'.join(this._w._urlNew, this.pk)
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
            w.net.post(this._walaxUrlNew, {}, saveFields, {}).then(ret => {
                this.updateFields(ret)
            })
        } else {
            // ERROR CHECKING FOOL
            w.net
                .put(this._walaxUrl, {}, saveFields, {})
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
