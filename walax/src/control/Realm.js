

const Realm = {
  _realm: false,
  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
  init() {  // todo
    this._realm = this.getUrlParameter('realm')
  },
  get realm() {
    return this._realm
  },
  set realm(realm) {
    if (this._realm)
      throw new TypeError('realm cannot be changed')
    this._realm = realm
    //todo : alot
    return this._realm
  },
}

export default Realm