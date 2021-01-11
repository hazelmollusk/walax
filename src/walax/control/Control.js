import Entity from '../util/Entity'

const { observable } = require('mobx')
/**
 * Base class that controllers must extend
 *
 * @export
 * @class Control
 * @extends {Entity}
 */
export default class Control extends Entity {
  constructor () {
    super()
  }
}
