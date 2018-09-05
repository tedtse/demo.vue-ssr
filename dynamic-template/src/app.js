import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'

import { createRouter } from './router'

Vue.use(ElementUI)

export function createApp () {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(App)
  })

  return { app, router }
}
