// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(`${__dirname}/../dist`),
    filename: 'walax.js'
  },
  module: {
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 10
            }
          }
        ]
      ],
      sourceMaps: true,
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-proposal-logical-assignment-operators'
      ]
    },
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
