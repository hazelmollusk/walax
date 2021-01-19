import Schema from '../Schema'
import DjangoModel from './DjangoModel'
import DjangoManager from './DjangoManager'
import w from '../../Walax'

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export class DjangoSchema extends Schema {
    _defaultModel = DjangoModel
    _defaultManager = DjangoManager

    constructor(url = false, name = false, models = false) {
        super(url, name, models)
    }

    initSchema(data) { }

    getManager(model) {
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

    toString() {
        return `django schema ${this._name}`
    }

    init(data) {
        super.init(data)
    }

    loadUrl(url) {
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
                    let fields = modelInfo.actions.POST
                    let modelClassName = capitalize(modelName)
                    // let modelClassName = modelInfo.name
                    //     .replace(' List', '')
                    //     .replace(' ', '')
                    let opts = {
                        urlNew: modelRootUri,
                        fieldsNew: fields,
                        fields: fields,
                        name: modelClassName
                    }

                    let m = this.createModel(modelClassName, opts)
                    this.d(`created model class ${modelClassName}`, m)
                })
            }
        })
    }
}
