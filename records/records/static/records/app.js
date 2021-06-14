import w from 'walax'
import m from 'mithril'
import {observable} from 'mobx'
let url = '/records/api/?format=json'
let prop = 'records'

console.log(w)
w.obj.load('records','/records/api/')

w.obj.Band.objects.all().then(x => console.log(x))