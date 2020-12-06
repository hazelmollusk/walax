// import 'regenerator-runtime/runtime'

let url = '/records/api/?format=json'
let name = 'records'


w.log.info(`loading api from ${url} into ${name}`)
w.obj.load(url, name)
