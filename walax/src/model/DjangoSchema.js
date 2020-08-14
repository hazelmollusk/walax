import WalaxModel from './WalaxModel'
import { observable } from 'mobx'
import { WalaxSchema } from './WalaxSchema'
const m = require('mithril')
const w = require('../Walax.js')

class ApiOperation {
  constructor(path) {
    this.summary = path.summary || ''
     this.description = path.description || ''
  }

}

export class DjangoSchema extends WalaxSchema {
  _uri = false
  _url = false
  _servers = false
  _customModels = false
  ops = observable.map()
  models = observable.map()

  constructor(uri = false, models = false) {
    super()
      this.initialize()
    if (uri) this.loadURI(uri, models)
  }



  // uri in this case is expected to be a DRF API root URL

  parseData(data, models) {
    this.parseInfo(data)
    
  }
}
