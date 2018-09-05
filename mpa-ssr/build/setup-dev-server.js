const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')

module.exports = function (server, templatePath, pageName, clientConfig, serverConfig, cb) {
  const readFile = (fs, file) => {
    try {
      return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
    } catch (e) {}
  }

  let bundle
  let template
  let clientManifest

  let ready
  const readyPromise = new Promise(resolve => { ready = resolve })
  const update = () => {
    if (bundle && clientManifest) {
      ready()
      cb(pageName, bundle, {
        template,
        clientManifest
      })
    }
  }

  template = fs.readFileSync(templatePath, 'utf-8')
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    console.log('index.html template updated.')
    update()
  })

  let HMRPath = '/__webpack_hmr_' + pageName
  for (let app in clientConfig.entry) {
    clientConfig.entry[app] = ['webpack-hot-middleware/client?path=' + HMRPath, clientConfig.entry[app]]
  }
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })
  server.use(devMiddleware)
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => { console.error(err) })
    stats.warnings.forEach(err => { console.warn(err) })
    if (stats.errors.length) { return }
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      './server/' + pageName + '/vue-ssr-client-manifest.json'
    ))
    update()
  })

  server.use(require('webpack-hot-middleware')(clientCompiler, {
    heartbeat: 5000,
    path: HMRPath
  }))

  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) { throw err }
    stats = stats.toJson()
    if (stats.errors.length) { return }
    bundle = JSON.parse(readFile(mfs, './server/' + pageName + '/vue-ssr-server-bundle.json'))
    update()
  })

  return readyPromise
}
