import Manager from '../Manager'
import DjangoQuery from './DjangoQuery'
import DjangoModel from './DjangoModel'

export default class DjangoManager extends Manager {
    constructor(model) {
        super(model)
        this.model = model
    }

    model = DjangoModel

    get params() {
        return {}
    }

    async all() {
        let query = new DjangoQuery(this)
        return query
    }

    async filter(args) {
        let query = new DjangoQuery(this, args)
        return query
    }

    async exclude(...args) {
        let query = new DjangoQuery(this, args, true)
        return query
    }

    async none() {
        return this.all().none() 
    }

    get serialized() {
        return this.model._w.name
    }
}
