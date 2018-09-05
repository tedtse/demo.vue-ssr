import Vue from 'vue'
// import __sdk__ from  '__sdk__'
import App from './App.vue'
import { createRouter } from './router'

// Vue.use(__sdk__)

export function createApp () {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(App)
  })

  return { app, router }
}
