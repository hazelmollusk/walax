import {observable} from 'mobx'

export default class KeyedSingleton {
  static _instances = observable.map()
  static _klass = KeyedSingleton

  static getInstance(name) {
    
  }
}