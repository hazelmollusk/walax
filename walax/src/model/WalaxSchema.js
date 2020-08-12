import WalaxModel from './WalaxModel'

//todo schema versioning/collision detection/etc
export class WalaxSchema {
    schema = false
    models = false
    ops = false
    title = false
    description = false
    version = false

    checkModel(model) {
        if (!(model instanceof WalaxModel)) return false
        return true
    }
}
