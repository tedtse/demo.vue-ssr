import Vue from 'vue'
import Router from 'vue-router'

import comp1 from '../views/comp1.vue'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: comp1
      }
    ]
  })
}
