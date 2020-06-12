import Walax from '../Walax'
const { observable } = require('mobx')

class Control extends Walax {
  constructor () {
    super()
  }
}

export default { Control: observable(Control.instance()) }
