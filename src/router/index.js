import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'
import axios from 'axios'
import url from '@mock/mockAPI.js'
// import notFound from '../views/notFound.vue'
// import basePage from '../views/basePage.vue'
// import preview from '../views/preview.vue'
// import colorTest from '../views/colorTest.vue'
// import login from '../views/login.vue'
// import templateSelect from '../views/templateSelect.vue'
// import register from '../views/register.vue'

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
    // component: notFound
  },
  {
    path: '/basePage',
    name: 'basePage',
    component: () => import(/* webpackChunkName: "basePage" */ '../views/basePage.vue')
    // component: basePage
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import(/* webpackChunkName: "preview" */ '../views/preview.vue')
    // component: preview
  },
  {
    path: '/colorTest',
    name: 'colorTest',
    component: () => import(/* webpackChunkName: "colorTest" */ '../views/colorTest.vue')
    // component: colorTest
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
    // component: login
  },
  {
    path: '/templateSelect',
    name: 'templateSelect',
    component: () => import(/* webpackChunkName: "templateSelect" */ '../views/templateSelect.vue')
    // component: templateSelect
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/register.vue')
    // component: register
  }
]

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.path == '/' || to.path == '/login' || to.path == '/register') {
//     next()
//   } else {
//     if (store.state.currentUserID == -1) {
//       next('/')
//       alert('请先登录')
//     } else {
//       axios({
//         url: url.refreshLoginStatus,
//         method: 'get',
//         data: {
//           userID: store.state.currentUserID
//         }
//       }).then(res => {
//         if (res.data.loginStatus == true) {
//           window.localStorage.setItem('Auth-Token', res.data.token)
//         }
//       })
//     }
//   }
// })

export default router
