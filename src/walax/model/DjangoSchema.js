import WalaxModel from './WalaxModel'
import { observable } from 'mobx'
import { WalaxSchema } from './WalaxSchema'
import DjangoModel from './DjangoModel'
import DjangoManager from './DjangoManager'
import w from '../Walax'
import Logger from '../control/Logger'

export class DjangoSchema extends WalaxSchema {
  _defaultModel = DjangoModel
  _defaultManager = DjangoManager

  constructor (url = false, name = false, models = false) {
    super(url, name, models)
  }

  getManager (model) {
    // allows instances/names to be passed in
    if (typeof model == 'string') model = this.models.get(model)
    if (model?._model) model = model._model
    return w.cache.find('managers', model, m => {
      let mgrClass = `${m._name}Manager`
      if (this.models.has(mgrClass)) return new mgrClass(m)
      return new this._defaultManager(model)
    })
  }
  // url in this case is expected to be a DRF API root URL

  toString () {
    return `django schema ${this._name}`
  }

  init () {}

  loadUrl (url) {
    this.d(`loadUrl ${url}`)
    w.net.options(url).then(info => {
      this.d(`receiving data for ${url}`, info)
      this.title = info.name || 'Untitled'
      this.description = info.description || ''
      this.schema = info
    })
    w.net.get(url).then(data => {
      for (let modelName in data) {
        let modelRootUri = data[modelName]
        w.net.options(modelRootUri).then(modelInfo => {
          this.d(`retrieved options for model ${modelName}`, data)
          let modelClassName = modelInfo.name
            .replace(' List', '')
            .replace(' ', '')
          let opts = {
            url: modelRootUri,
            modelClassName
          }
          let fields = modelInfo.actions.POST

          let m = this.createModel(modelClassName, fields, opts)
          this.d(`created model class ${modelClassName}`, m)
        })
      }
    })
  }
}
