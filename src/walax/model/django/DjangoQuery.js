import w from '../../Walax'
import Entity from '../../util/Entity'

class DjangoQueryProxy extends Entity {
    query = false
    keys = false

    constructor(manager) {
        super()
        this.manager = manager
    }

    [Symbol.iterator]() {
        this.keys = this.manager.cache
        return this
    }

    next() {
        let cur = this.keys.next()
        if (cur.done) return cur
        let obj = w.obj.getObject(this.manager.model, cur.value)
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
    constructor(parent, filter = false, flip = false, single = false) {
        // todo: sanity check
        super()
        this.parent = parent
        this.flip = flip
        this.filter = filter
        this.single = single
    }

    get model() {
        return this.parent.model
    }

    get serialized() {
        let rec = ''
        for (let f in this.filter) rec += `(${f}=${this.filter[f]})`
        if (this.single) rec = '#' + rec
        if (this.flip) rec = '!' + rec
        rec = `${this.parent.serialized}+[${rec}]`
        return rec
    }

    [Symbol.iterator]() {
        return new DjangoQueryProxy(this.w, this)
    }

    get cached() {
        return w.cache.find(false, 'querie s', this.serialized)
    }

    set cached(val) {
        return w.cache.store(val, 'queries', this.serialized)
    }
    get cache() {
        if (!this.cached) this.fetch()
        return this.cached
    }

    async fetch() {
        let res = new Set()
        return w.net.get(this.model.modelUrl).then(data => {
            if (data.length) {
                this.d('data returned',data)
                data.forEach(o => {
                    let newObj = w.obj.receiveObject(this.model, o)
                    this.d('got object', newObj)
                    res.add(newObj)
                })
            }
            this.d('fetch returns', res)
            return res
        })
    }

    async all() {
        let a = this.fetch()
        return a.then(res=>{
            return res
        })
    }

    async none() {
        return new DjangoQuery(this, false, true)
    }

    async filter(args) {
        return new DjangoQuery(this, args)
    }

    async exclude(args) {
        return new DjangoQuery(this, args, true)
    }
}

export default DjangoQuery
