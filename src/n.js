class test {

    t=0
    get gg () { return this.t }

    constructor(){}
    f() {
        let x=123
        class z {
            constructor(){}
            u() { return x }
        }
        return z
    }
}

class test2 extends test {
    t = 3
    constructor() {
        super()
    }
}

let a1 = new test()
let a2 = new (a1.f())

let a3 = new test2()

console.log(a3.gg)
