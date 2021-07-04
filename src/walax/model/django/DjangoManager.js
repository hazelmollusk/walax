import Manager from '../Manager'
import DjangoQuery from './DjangoQuery'
import DjangoModel from './DjangoModel'

export default class DjangoManager extends Manager {
    constructor(model) {
        super(model)
        this.model = model
    }

    model = DjangoModel

    async all() {
        this.query = new DjangoQuery(this)
        return this.query.all()
    }

    async filter(args) {
        return this.all().filter(args)
    }

    async exclude(...args) {
        return this.all().exclude(args)
    }

    async none() {
        return this.all().none()
    }

    get serialized() {
        return `{${this._model._name}}`
    }
}
