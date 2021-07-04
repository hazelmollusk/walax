import w from 'walax'
import m from 'mithril'
import {observable} from 'mobx'

let url = '/records/api/'
let prop = 'records'

w.obj.load(prop, url)