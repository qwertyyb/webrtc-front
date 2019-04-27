import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: 'front',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/videos'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/presentor',
      name: 'presentor',
      component: _ => import('./views/presentor')
    },
    {
      path: '/livings',
      name: 'livings',
      component: _ => import('./views/live/list')
    },
    {
      path: '/live/:liveId',
      name: 'live',
      component: _ => import('./views/live')
    },
    {
      path: '/videos',
      name: 'videos',
      component: _ => import('./views/video/index')
    },
    {
      path: '/call',
      name: 'call',
      component: _ => import('./views/call/index')
    },
    {
      path: '/accept',
      name: 'acceptcall',
      component: _ => import('./views/call/accept')
    },
    {
      path: '/login',
      name: 'login',
      component: _ => import('./views/login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.state.token && to.name !== 'login') {
    return next('/login')
  }
  if (store.state.token && to.name === 'login') {
    return next('/')
  }
  next()
})

export default router
