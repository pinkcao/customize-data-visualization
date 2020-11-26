import Vue from 'vue'
import Router from 'vue-router'
import basePage from '../views/basePage.vue'
import preview from '../views/preview.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TestPage',
      // component: TestPage
      redirect: '/basePage'
    },
    {
      path: '/basePage',
      name: 'basePage',
      component: basePage
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview
    }
  ]
})
