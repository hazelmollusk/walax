import BaseControl from './BaseControl'

export default class Test extends BaseControl {
  constructor(){ super()
  }
  toString() {
    return 'View'
  }
  toggle (elm) {
    if (typeof elm == 'string') elm = document.getElementById(elm)
    d(elm.style)
    elm.style.display = elm.style.display == 'none' ? 'block' : 'none'
  }
}
