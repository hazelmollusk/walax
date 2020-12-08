import w from './walax/Walax'

let url = '/records/api/?format=json'
let name = 'records'
console.log('f', w.log)

w.log.info(`loading api from ${url} into ${name}`)
w.obj.load(url, name)
