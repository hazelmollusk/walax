// import 'regenerator-runtime/runtime'
import { Walax, w } from './walax/Walax'

// this will force a reload on reconfig
import '../webpack.config'

window.w = w
module.exports = w
