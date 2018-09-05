import Vue from 'vue'
import Router from 'vue-router'

import frame from '../views/frame.vue'

Vue.use(Router)

export function createRouter () {
  return new Router({
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        direct: '/frame'
      },
      {
        path: '/frame',
        component: frame
      }
    ]
  })
}
