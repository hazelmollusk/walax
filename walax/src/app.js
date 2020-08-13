import w from './Walax'

w.log.register(msg => console.log(msg))

w.obj.loadUri('/records/openapi/?format=openapi-json', 'records')
