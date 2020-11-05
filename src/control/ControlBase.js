const { observable } = require('mobx')

export default class ControlBase {
  constructor (wlx) {
    this.w = wlx
  }
}