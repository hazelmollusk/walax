import WalaxModel from './WalaxModel'
import { observable } from 'mobx'
import { WalaxSchema } from './WalaxSchema'
import DjangoModel from './DjangoModel'
import w from '../Walax'

export class DjangoSchema extends WalaxSchema {
  _defaultModel = DjangoModel
  constructor (uri = false, models = false) {
    super(uri, models)
  }

  // uri in this case is expected to be a DRF API root URL

  parseData (uri, data, models) {
    w.net.options(uri).then(info => {
      this.title = info.name || 'Untitled'
      this.description = info.description || ''
    })
    /* initial data will be model (plural) -> URL (we hope) */
    for (let modelName in data) {
      let modelRootUri = data[modelName]
      w.net.options(modelRootUri).then(modelInfo => {
        // works if you have a very generic DRF setup... todo
        let modelClassName = modelInfo.name.replace(' List', '')
        let fields = modelInfo.actions.POST

        let BaseModel = models?.get?.(modelClassName) || DjangoModel

        let classes = {}
        classes[modelClassName] = class extends BaseModel {
          _fields = fields
          _name = modelClassName
          _modelUri = modelRootUri
          _schemaUri = uri
          _uri = false
          _new = true
          constructor (data = false) {
            super()
            this.initFields()
          }
        }

        w.augment(
          this,
          modelClassName,
          { value: classes[modelClassName] },
          true
        )
      })
    }
  }
}
