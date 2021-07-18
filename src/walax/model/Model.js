import Manager from './Manager'
import Entity from '../util/Entity'
import w from '../Walax'

export default class Model extends Entity {
    
    static defaultManager = Manager

    constructor(data) {
        super()
        this._w = {
            model: this.constructor,
            values: new Map(),
            dirty: new Set()
        }
        this._initModel(data)
    }

    static get objects() {
        //fixme one manager per manager/model tuple
        this.manager ||= new this.defaultManager(this)
        return this.manager
    }

    static get fields() {
        return this._w.fields
    }

    static get fields() { return this._w.fields }

    get pk() {
        return this[this._w.model.pk]
    }

    get url() {
        return this._w.url
    }

    set url(u) {
        this._w.url = u
    }

    save() {
        this.a(false, 'model class must implement save()')
    }

    delete() {
        this.a(false, 'model class must implement delete()')
    }

    _initModel(data) {
            
        this._w ||= {}
        Object.assign(this._w, {
            dirty: new Set(),
            values: new Map(),
            url: false,
            new: true,
            values: new Map(),
        })
        this.d('initmodel', this)
        if (Object.keys(this._w.model.fields).length) {
            Object.keys(this._w.model.fields).forEach(fn => {
                this.d(`field ${fn}`)
                w.augment(
                    this,
                    fn,
                    this._walaxGetField(fn),
                    this._walaxSetField(fn)
                )
                //FIXME at the very least per-type
                
                this._setFieldDefault(fn)
            })
            if (this._w.model.relatedQueries) {
                Object.keys(this._w.model.relatedQueries).forEach(rn => {
                    w.augment(this, rn, this._w.model.relatedQueries[rn])
                })
            }
            if (data) {
                for (let fn in data) {
                    this.d('setting field', fn, data[fn])
                    if (fn == 'url') {
                        this._w.url = data[fn]
                    } else {
                        this._w.values.set(fn, data[fn])
                    }
                }
            }
        }
    }

    _validateFields() {
        this.a(false, 'not implemented')
    }

    _getField(fn) {
        this.a(false, 'not implemented')
    }

    _setField(fn) {
        this.a(false, 'not implemented')
    }

    _setFieldDefault(field) {
        if (field == 'url') return true
        this._w.values.set(field, undefined)

        let fd = this._w.model.fields[field]
        switch (fd.type) {
        }
        return true
    }

    _walaxGetField(field) {
        if (this._getField) return this._getField(field)
        return () => this._w.values.get(field)
    }

    _walaxSetField(field) {
        if (this._setField) return this._setField(field)
        return val => {
            let newVal = val
            this._w.dirty.add(field)
            this._w.values.set(field, newVal)
            return newVal
        }
    }

    toString() {
        return `object`
    }
}
