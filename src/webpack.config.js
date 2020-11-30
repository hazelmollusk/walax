// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(`${__dirname}/../dist/walax/`),
    filename: 'walax.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, // include .js files
        exclude: /node_modules/, // exclude any and all files in the `node_modules folder`
        use: [
          {
            loader: 'babel-loader',
            sourceMaps: true,
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                ['@babel/plugin-transform-runtime'],
                ['@babel/plugin-syntax-dynamic-import'],
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-proposal-logical-assignment-operators'],
                ['@babel/plugin-proposal-optional-chaining']
              ]
            }
          }
        ]
      }
    ]
  }
}
