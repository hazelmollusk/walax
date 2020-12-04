import 'regenerator-runtime/runtime'

url = '/records/api/?format=json'
name = 'records'

w.log.info(`loading api from ${url} into ${name}`)
w.obj.load(url, name)
