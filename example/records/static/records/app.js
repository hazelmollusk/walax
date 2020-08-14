w.log.register(msg => console.log(msg))

w.obj.load('/records/api/?format=json', 'records')
