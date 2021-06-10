const path = require('path');

module.exports = {
  mode: 'development',
  // entry: './src/Walax.js',
  output: {
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'walax.js',
     library: {
         name: 'walax',
         type: 'umd'
       }
  }
}
