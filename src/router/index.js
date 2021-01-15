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
      path: '*',
      redirect: '/notFound'
    },
    {
      path: '/notFound',
      name: 'notFound',
      component: () => import(/* webpackChunkName: "notFound" */ '../views/notFound.vue')
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
    },
    {
      path: '/templateSelect',
      name: 'templateSelect',
      component: () => import(/* webpackChunkName: "templateSelect" */ '../views/templateSelect.vue')
    }
  ]
})
