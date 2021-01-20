# Welcome to walax 👋
[![Version](https://img.shields.io/npm/v/walax.svg)](https://www.npmjs.com/package/walax)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> walax : django :: django : sql

Walax is a Javascript framework for interacting with objects remotely via Django.  The goal is to provide a 'batteries-included' library for easily creating front-end applications, which automatically consumes and instantiates its interface from CoreAPI-compatible remote.  

While other implementations should be possible, walax was designed and tested using  Django and DRF (see the example `records` Django project for a simple working configuration).

### 🏠 [Homepage](https://github.com/hazelmollusk/walax)

Walax is meant to provide all the scaffolding for a fully-featured client-side application with API backing; as such, it encompasses an array of common functionality, and attempts to present them in an integrated fashion.  It includes a Django API for simple server configuration.

Walax has two main dependencies:

* mithril: view components and routing, as well as XHR
* mobx: state management

Both libraries are small, fast, and provide (in the author's opinion ;) powerful, un-intrusive access to critical features required by an SPA; walax is therefore opinionated on these choices.  (You can use just the object system with whatever state/display/routing library you like, but these are used internally by walax, and are included in the exposed interface.)

For now, here are some examples of the walax API:

## Examples
    // Javascript 
    import w from Walax
    w.initialize()
    w.load('/api')

    # Python
    from django.urls import path, include
    from walax.routers import WalaxRouter
    from .models import MODELS
    router = WalaxRouter()
    for model in MODELS:
        router.register_model(model)
    ...
    urlpatterns += path('api/', include(router.urls))

### Making remote requests

    w.net.get('/records/api/?format=openapi-json')

    w.net.delete('/api/endpoint/', {id: 23})

    w.net.post('/some/form/somewhere', {}, '<request body goes here>')

### Logging

    w.log.info('just fyi', someVar)

    w.log.error('oh dear')  // will throw an exception

    w.log.fatal('i give up')  // terminates 

    w.log.assert(1>2, 'math stopped working')  // asserts

    let a = new Band()
    a.name = 'Beatles'
    a.d('band-specific debug message')
    // logs: "Band: Beatles", 'band-specific debug message')


### Objects (remote API)

    let Band = w.obj.records.Band
    
    let beatles = new Band()
    beatles.name = 'Beatles'
    // actually sets an integer from a Django `choices` field
    beatles.genre = 'Rock' 
    beatles.save()

    for (let band in Band.objects.all()) {
        // ...
    }

### Miscellaneous batteries

    class a extends WalaxEntity {}
    class b extends a {}
    class c extends b {}
    let d = new c()
    if (w.checkClass(d, a)) { /*...*/ }

    w.augment(d, 'prop', () => 1, x => console.log('set'))
    d.prop // returns 1

    d.d('debugging info', data)
    d.e('error message')  // throws a TypeError
    d.a(false, 'assertion failed')
    d.i('this is just information')

## Author

👤 **Matt Barry <matt@hazelmollusk.org>**

* Website: http://hazelmollusk.org
* Github: [@zaharazod](https://github.com/zaharazod)

## Show your support

Give a ⭐️ if this project helped you!


***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_