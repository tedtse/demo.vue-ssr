const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')
const router = require('../config/router')

const isProd = process.env.NODE_ENV === 'production'

let webpackConfigMap = {}
for (let pageName in router) {
  let pageConfig = router[pageName]
  let cConfig = merge({}, clientConfig, {
    entry: {
      [pageName]: `${pageConfig.dir}/entry-client.js`
    },
    output: {
      filename: isProd ? `js/${pageName}/[name].[chunkhash:8].js` : `js/${pageName}/[name].js`
    },
    plugins: [
      new VueSSRClientPlugin({
        filename: `server/${pageName}/vue-ssr-client-manifest.json`
      })
    ]
  })

  let sConfig = merge({}, serverConfig, {
    entry: {
      [pageName]: `${pageConfig.dir}/entry-server.js`
    },
    output: {
      filename: isProd ? `js/${pageName}/[name].[chunkhash:8].js` : `js/${pageName}/[name].js`
    },
    plugins: [
      new VueSSRServerPlugin({
        filename: `server/${pageName}/vue-ssr-server-bundle.json`
      })
    ]
  })

  webpackConfigMap[pageName] = {
    clientConfig: cConfig,
    serverConfig: sConfig
  }
}

module.exports = webpackConfigMap
