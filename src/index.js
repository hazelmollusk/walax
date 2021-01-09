// import 'regenerator-runtime/runtime'
import { Walax, w } from './walax/Walax'
import Entity from './walax/util/Entity'
import Schema from './walax/model/Schema'
import Model from './walax/model/Model'
import Manager  from './walax/model/Manager'
import Control from './walax/control/Control'

// this will force a reload on reconfig
import '../webpack.config'

w.augmentObj(w, 'classes', {
    Entity,
    Schema,
    Model,
    Manager,
    Control
})
window.w = w
export default w
