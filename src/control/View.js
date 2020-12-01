export default class View extends BaseControl {
  constructor (w) {
    super(w)
  }
  toggle (elm) {
    if (typeof elm == 'string') elm = document.getElementById(elm)
    d(elm.style)
    elm.style.display = elm.style.display == 'none' ? 'block' : 'none'
  }
}
