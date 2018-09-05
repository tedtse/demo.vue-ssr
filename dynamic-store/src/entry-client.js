import { createApp } from './app'

const { app, router, store } = createApp()
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const actived = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    if (!actived.length) {
      return next()
    }
    Promise.all(actived.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    }))
      .then(next)
      .catch(next)
  })

  app.$mount('#app')
})
