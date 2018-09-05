const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const compression = require('compression')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')
const router = require('./config/router')

const isProd = process.env.NODE_ENV === 'production'
const serverInfo =
  `express/${require('express/package.json').version}` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const resolve = file => (path.resolve(__dirname, file))
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

const app = express()

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 30
    }),
    basedir: resolve('./dist'),
    runInNewContext: false
  }))
}

let render
let rendererMap = {}
const baseRender = (renderer, pageName, req, res) => {
  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }
  let routerConfig = router[pageName]
  let context = {
    title: routerConfig.title,
    url: req.url
  }

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Server', serverInfo)
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    res.end()
  })
}

if (isProd) {
  for (let pageName in router) {
    const template = fs.readFileSync(resolve(router[pageName].template), 'utf-8')
    const bundle = require(`./dist/server/${pageName}/vue-ssr-server-bundle.json`)
    const clientManifest = require(`./dist/server/${pageName}/vue-ssr-client-manifest.json`)
    rendererMap[pageName] = createRenderer(bundle, {
      template,
      clientManifest
    })
  }
  render = (pageName, req, res) => {
    baseRender(rendererMap[pageName], pageName, req, res)
  }
} else {
  const devServerSetup = require('./build/setup-dev-server')
  const appEntry = require('./build/webpack.multiple.config')
  let promiseMap = {}
  for (let pageName in appEntry) {
    let entry = appEntry[pageName]
    let tplPath = router[pageName].template
    promiseMap[pageName] = devServerSetup(
      app,
      tplPath,
      pageName,
      entry.clientConfig,
      entry.serverConfig,
      (pageName, bundle, options) => {
        rendererMap[pageName] = createRenderer(bundle, options)
      }
    )
  }
  render = (pageName, req, res) => {
    baseRender(rendererMap[pageName], pageName, req, res)
  }
}

app.use(compression({ threshold: 0 }))
// app.use(favicon('./public/logo-48.png'))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
// app.use('/service-worker.js', serve('./dist/service-worker.js'))

for (let pageName in router) {
  let pageConfig = router[pageName]
  app.get(pageConfig.url, (pageName => {
    return (req, res) => {
      render(pageName, req, res)
    }
  })(pageName))
}

const port = process.env.PORT || 9998
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
