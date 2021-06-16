import w from 'walax'
import m from 'mithril'
import {observable} from 'mobx'

let url = '/records/api/'
let prop = 'records'

Promise.all(w.obj.load(prop, url))
console.log(w)
w.sleep(5000)
console.log('hi')