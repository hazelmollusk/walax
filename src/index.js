
import w from './walax/Walax'
import Entity from './walax/util/Entity'
import Schema from './walax/model/Schema'
import Model from './walax/model/Model'
import Manager from './walax/model/Manager'
import Control from './walax/control/Control'

w.initialize()
w.cls = {
     Entity, 
     Schema, 
     Model, 
     Manager, 
     Control 
}

export default w
 