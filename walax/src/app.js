import w from './Walax'
import { ObjectControl } from './control/'

w.log.register(msg => console.log(msg))

w.ctl.instance(ObjectControl, 'obj')
w.ctl.obj.schemaUri = '/records/openapi/?format=openapi-json'
