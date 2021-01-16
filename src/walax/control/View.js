import Control from './Control'

export default class View extends Control {
    constructor() {
        super()
    }
    toString() {
        return 'View'
    }
    toggle(elm) {
        if (typeof elm == 'string') elm = document.getElementById(elm)
        elm.style.display = elm.style.display == 'none' ? 'block' : 'none'
    }
}
