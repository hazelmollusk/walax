
import w from './walax/Walax'
w.initialize()
let klasses = [ Entity, Schema, Model, Manager, Control ]
for (let klass of klasses) {
    ww.addClass(klass)
}

export default w
 