import Vue from 'vue'
import Router from 'vue-router'

import comp1 from '../views/comp1.vue'
import comp2 from '../views/comp2.vue'

Vue.use(Router)

export function createRouter () {
  return new Router({
    // mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        redirect: '/comp1'
      },
      {
        path: '/comp1',
        component: comp1
      },
      {
        path: '/comp2',
        component: comp2
      }
    ]
  })
}
