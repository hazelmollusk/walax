class DjangoQuery {
  _model = false
  _parent = false
  _flip = false
  /**
   * Creates an instance of DjangoQuery.
   * @param {*} model
   * @param {*} parent
   * @param {dict} [args=false]
   * @param {boolean} [flip=false]
   * @memberof DjangoQuery
   */
  constructor (model, parent, args = false, flip = false) {
    this._model = model
    this._parent = parent
    this._flip = flip
    if (args) this.process(args)
  }

  process (args) {}

  all () {
    return new DjangoQuery(this.model, this)
  }

  none () {
    return new DjangoQuery(this.model, this, false, true)
  }

  filter (args) {
    return new DjangoQuery(this.model, this, args)
  }

  exclude (args) {
    return new DjangoQuery(this.model, this, args, true)
  }
}
