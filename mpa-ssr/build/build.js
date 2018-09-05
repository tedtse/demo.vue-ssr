const webpack = require('webpack');
const appEntry = require('./webpack.multiple.config')

for (let page in appEntry) {
  webpack(appEntry[page].clientConfig, () => {})
  webpack(appEntry[page].serverConfig, () => {})
}
