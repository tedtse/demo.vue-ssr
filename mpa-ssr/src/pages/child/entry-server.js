import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router } = createApp()
    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    router.push(url.replace(/^.*\.html/, '') || '/')

    router.onReady(() => {
      const matcedComponents = router.getMatchedComponents()
      if (!matcedComponents.length) {
        return reject({ code: 404 })
      }

      if (isDev) {
        console.log(`data pre-fetch: ${Date.now() - s}ms`)
      }
      resolve(app)
    })
  })
}
