
class Control {
  /**
   *Creates an instance of Control.
   * @param {boolean} [key=false]
   * @memberof Control
   *
   * Base class for Walax controller components;
   * not designed to be instantiated directly.
   *
   * This class (and descendants) will be
   * instantiated as singleton objects,
   * optionally one per unique key passed into:
   * Walax.ctrl.register (cls, key = false)
   */
  constructor (key = false) {
    this._wlx_ctrl_key = key
  }
}

export default Control
