import WalaxModel from './WalaxModel'
import { observable } from 'mobx'
import { WalaxSchema } from './WalaxSchema'
const m = require('mithril')
const w = require('../Walax.js')

export class DjangoSchema extends WalaxSchema {
  constructor (uri = false, models = false) {
    super(uri, models)
  }

  // uri in this case is expected to be a DRF API root URL

  parseData (data, models) {
    
  }
}
