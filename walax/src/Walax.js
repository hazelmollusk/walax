import WalaxController from './walax/WalaxController'
import WalaxNetwork from './walax/WalaxNetwork'
import WalaxLogger from './walax/WalaxLogger'

const { observable } = require('mobx')

export const Walax = observable({
  log: WalaxLogger,
  net: WalaxNetwork,
  ctl: WalaxController
})

export const w = Walax
export default w
