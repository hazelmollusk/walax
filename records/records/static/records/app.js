// import w from 'walax'
const w = require('./walax')
let url = '/records/api/?format=json'
let prop = 'records'

w.initialize()
w.log.info(`loading api from ${url} into ${prop}`)
w.obj.load(url, prop)

let a = new w.obj.records.Band()
a.name = 'app band'
a.save()
