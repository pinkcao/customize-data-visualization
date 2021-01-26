import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'

Vue.use(Router)

const routes = [
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

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  //console.log(store.state.isLogin);
  if (to.path == '/' || to.path == '/login') {
    next()
  } else {
    if (store.state.currentUserID == -1) {
      next('/login')
      alert('请先登录')
    } else {
      next()
    }
  }
})

export default router
