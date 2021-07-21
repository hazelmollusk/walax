import w from 'walax'
import m from 'mithril'
import {observable} from 'mobx'

let url = '/records/api/'
let prop = 'records'

var Stores = observable({
    list: [],
    addStore(name) {
        let s = new w.obj.Store()
        s.name = name
        s.save()
        Stores.loadList()
    },
    loadList: function () {
        Stores.list = []
        return w.sleep(200).then(x=>{
            return w.obj.Store.objects.all().then(x => {
                x.forEach(z => { Stores.list.push(z) } )
                w.log.debug('Stores', Stores)
            })
        })
    },
    oninit: function() { Stores.loadList() },
    view: function () {
        return m('ul', Stores.list.map(s => {
            return m('li', [
                m('a',{ onclick:() => {
                    s.delete().then(x => { Stores.loadList() })
                }, href:'#'}, 'X'),
                m('.storeId', s.id),
                m(`input.storeName#storeName${s.id}`, {
                    value:s.name,
                    oninput: (x) => {
                        let sub = document.getElementById(`storeSubmit${s.id}`)
                        sub.hidden = false
                        let el = document.getElementById(`storeName${s.id}`)
                        el.value = x.target.value
                        s.name = el.value
                        return true
                    }
                }),
                m(`input.storeSubmit#storeSubmit${s.id}`, {
                    value:'Submit change',
                    hidden:true,
                    type:'submit',
                    onclick:()=>{
                        s.save().then(x => {Stores.loadList()})
                        return false
                    }
                })
            ])
        }))
    }
})
w.obj.load(prop, url).then(x=>{
    window.Stores = Stores
    var e = document.getElementById('stores')
    console.log(e)
    m.mount(e, Stores)
})  