const m = require('mithril')

export default class Network extends BaseControl {
  constructor (w) {
    super(w)
  }
  /**
   * public methods for each HTTP method
   *
   * @param {*} url
   * @param {*} params
   * @param {*} body
   * @param {*} options
   * @returns {Promise}
   */
  async post (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'POST']))
  }
  async get (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'GET']))
  }
  async put (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'PUT']))
  }
  async delete (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'DELETE']))
  }
  async options (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'OPTIONS']))
  }
  async patch (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'PATCH']))
  }
  async head (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'HEAD']))
  }

  // TODO: websockets
  /**
   * pass a request through to mithril
   *
   * @param {*} options
   * @returns {Promise}
   */
  async _req (options) {
    a(options, 'empty request options')
    options.headers ||=
      'Accept: application/vnd.oai.openapi+json, application/json'
    a(this._chkOpts(options), 'bad request options', options)
    d(`Request: ${options.method.toUpperCase()} ${options.url}`, options)
    return m.request(options)
  }

  /**
   * check validity of request options object
   *
   * @param {object} opts
   * @returns {boolean}
   */
  _chkOpts (opts) {
    // todo better sanity?
    return opts.url && opts.method
  }

  /**
   * formats parameters into request options for mithril
   *
   * @param {string} url
   * @param {object} params
   * @param {object} body
   * @param {object} options
   * @param {string} [method='GET']
   * @returns {object}
   */
  _reqOpts (url, params, body, options, method = 'GET') {
    const opts = { ...{ url, params, body, method }, ...(options || {}) }
    // todo defaults?
    return opts
  }
}
