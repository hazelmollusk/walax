import Control from './Control'

export default class Test extends Control {
    constructor() {
        super()
    }
    toString() {
        return 'Test'
    }
    getPropName() {
      return 'test'
    }
    toggle(elm) {
        if (typeof elm == 'string') elm = document.getElementById(elm)
        d(elm.style)
        elm.style.display = elm.style.display == 'none' ? 'block' : 'none'
    }
}
