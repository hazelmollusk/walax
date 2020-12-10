let url = '/records/api/?format=json'
let name = 'records'

w.init()
w.log.info(`loading api from ${url} into ${name}`)
w.obj.load(url, name)

let a = new w.obj.records.Song()
