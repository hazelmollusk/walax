export default class View  extends BaseControl {
  toggle (elm) {
    if (typeof elm == 'string') elm = document.getElementById(elm)
    d(elm.style)
    elm.style.display = elm.style.display == 'none' ? 'block' : 'none'
  }
}
