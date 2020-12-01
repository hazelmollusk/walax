import WalaxEntity from '../util/WalaxUtil'
const { observable } = require('mobx')

export default class BaseControl extends WalaxEntity {
  constructor (w) {
    super(w)
  }
}
