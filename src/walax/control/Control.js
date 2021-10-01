import Entity from '../util/Entity'

const { observable } = require('mobx')

export default class Control extends Entity {
  constructor () {
    super()
  }
  initialize () {}
  toString () {
    return 'Control'
  }
  getPropName() {
    throw new TypeError('getPropName not implemented')
  }
  async load (key, url) {
    return true
  }
}
