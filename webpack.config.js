// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const webpack = require('webpack')
const path = require('path')

module.exports = {
  name: 'name',
  mode: 'development', // "production" | "development" | "none"
  target: 'web', // node
  entry: {
    walax: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'walax.js',
    // library: 'walax',
    // libraryTarget: 'umd',
    // umdNamedDefine: true
  },
  externals: {
    // lodash: {
    //   commonjs: 'lodash',
    //   commonjs2: 'lodash',
    //   amd: 'lodash',
    //   root: '_'
    // } fff
  },
  module: {
    rules: [
      {
        test: /\.js$/, // include .js files
        exclude: /node_modules/, // exclu2234de any and all files in the `node_modules folder`
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                ['@babel/plugin-transform-runtime'],
                ['@babel/plugin-syntax-dynamic-import'],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-proposal-object-rest-spread'],
                ['@babel/plugin-proposal-logical-assignment-operators'],
                ['@babel/plugin-proposal-optional-chaining'],
                ['@babel/plugin-proposal-decorators', { legacy: true }]
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    //   minimize: false,
    namedModules: true,
    namedChunks: true,
    removeAvailableModules: false,
    flagIncludedChunks: true,
    occurrenceOrder: false,
    usedExports: true,
    providedExports: true,
    concatenateModules: false,
    sideEffects: false // <----- in prod defaults to true if left blank
  }
}
