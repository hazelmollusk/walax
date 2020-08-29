

class DjangoQuery {
  _model = false
  _parent = false
  _flip = false

  constructor(model, parent=false, flip=false, ...args) {
    this._model = model
    this._parent = parent
    this._flip = flip
    if (args) this.process(args)
  }

  process(args) {
    
  }

  all() {
    return new DjangoQuery(this.model, this)
  }

  none() {
    return new DjangoQuery(this.model, this, true)
  }

  filter(...args) {
    return new DjangoQuery(this.model, this, ...args)
  }

  exclude(...args) {
    return new DjangoQuery(this.model, this, true, ...args)
  }
}