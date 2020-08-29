const m = require('mithril')

const Network = {
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
  },
  async get (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'GET']))
  },
  async put (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'PUT']))
  },
  async delete (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'DELETE']))
  },
  async options (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'OPTIONS']))
  },
  async patch (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'PATCH']))
  },
  async head (u, p, b, o) {
    return this._req(this._reqOpts(...[u, p, b, o, 'HEAD']))
  },

  // TODO: websockets
  /**
   * pass a request through to mithril
   *
   * @param {*} options
   * @returns {Promise}
   */
  async _req (options) {
    if (!options) throw new Error(options)
    if (!options.headers)
      options.headers = {
        Accept: 'application/vnd.oai.openapi+json, application/json'
      }
    if (!this._chkOpts(options)) {
      throw new TypeError('fields are messed up ')
    }
    return m.request(options)
  },

  /**
   * check validity of request options object
   *
   * @param {object} opts
   * @returns {boolean}
   */
  _chkOpts (opts) {
    // todo better sanity?
    return opts.url && opts.method
  },

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

export default Network
