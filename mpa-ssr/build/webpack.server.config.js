const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const base = require('./webpack.base.config')

const config = merge(base, {
  target: 'node',
  devtool: '#source-map',
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'development',
      'process.env.VUE_ENV': '"server"'
    })
  ]
})

module.exports = config
