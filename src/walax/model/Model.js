import Manager from './Manager'
import Entity from '../util/Entity'
import w from '../Walax'

export default class Model extends Entity {
    
    constructor(data) {
        super()
        this._w = {
            model: this.__proto__,
            values: new Map(),
            dirty: new Set()
        }
    }

    static _w = { 
        defaultManager: Manager
    }
    static get manager() {
        return this.objects
    }

    static get objects() {
        this._w.manager ||= new this._w.defaultManager(this)
        return this._w.manager
    }

    save() {
        this.a(false, 'model class must implement save()')
    }

    delete() {
        this.a(false, 'model class must implement delete()')
    }
}
