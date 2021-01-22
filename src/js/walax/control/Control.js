import Entity from '../util/Entity'

const { observable } = require('mobx')

export default class Control extends Entity {
    constructor() {
        super()
    }
    toString() { return 'Control' }
}
