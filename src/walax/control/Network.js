import Control from './Control'
const m = require('mithril')
import w from '../Walax'

export default class Network extends Control {
  constructor () {
    super()
  }

  toString () {
    return 'Network'
  }
  getPropName () {
    return 'net'
  }
  load (url) {
    this.baseUrl = url
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
    this.a(options, 'empty request options')
    options.headers ||= {}
    options.headers.Accept =
      'application/vnd.oai.openapi+json, application/json'
    if (w.auth.state) {
      options.headers.Authorization = `Bearer ${w.auth.token}`
    }

    this.a(this._chkOpts(options), 'bad request options', options)
    this.d(`Request: ${options.method.toUpperCase()} ${options.url}`, {
      options
    })

    return m
      .request(options)
      .then(data => {
        this.d('received data', { options, data })
        return data
      })
      .catch(err => {
        this.d('request error', { options, err })
        //todo smarter than this
        return w.auth.refreshToken().then(x => {
          return m.request(options).then(data => {
            this.d('received data after reauth', { options, data })
            return data
          })
        })
      })
    // .then(ret => {
    //     this.d('Network data', ret)
    // })
  }

  /**
   * check validity of request options object
   *
   * @param {object} opts
   * @returns {boolean}
   */
  _chkOpts (opts) {
    // todo better sanity?
    let ret = typeof opts?.url == 'string' && opts?.method
    this.d('checking options', opts, ret)
    return ret
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
    // if (!url.startsWith('http'))
    //     url = this.baseUrl + url  //FIXME
    // this.d("transformed url", url)
    this.a(url, 'incorrect request options', {
      url,
      params,
      body,
      options,
      method
    })
    const opts = { ...{ url, params, body, method }, ...(options || {}) }
    // todo defaults?
    return opts
  }
}
