import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/basePage',
      name: 'basePage',
      component: () => import(/* webpackChunkName: "basePage" */ '../views/basePage.vue')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import(/* webpackChunkName: "preview" */ '../views/preview.vue')
    },
    {
      path: '/colorTest',
      name: 'colorTest',
      component: () => import(/* webpackChunkName: "colorTest" */ '../views/colorTest.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
    }
  ]
})
