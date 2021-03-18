// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vuex from 'vuex';
// import App from "./App";
import Vue from 'vue'
import testLayout from './layout/testLayout.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import less from 'less'
import VueDragResize from 'vue-drag-resize'
import VueDragResizeRotate from './common/commonComponents/vueDragResizeRotate/vueDragResizeRotate.vue'
import url from '@mock/mockAPI.js'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(less)
Vue.component('vue-drag-resize', VueDragResize)
Vue.component('vue-drag-resize-rotate', VueDragResizeRotate)
Vue.config.productionTip = false
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
  if (window.localStorage.getItem('Auth-Token')) {
    config.headers['Authorization'] = window.localStorage.getItem('Auth-Token')
  }
  return config
})

axios.interceptors.response.use(
  response => {
    //拦截响应，做统一处理
    // console.log(response)
    return response
  },
  error => {
    if (error.response) {
      // console.log(error.response)
      switch (error.response.status) {
        case 401:
          window.localStorage.removeItem('Auth-Token')
          // console.log(router.currentRoute.path)
          if (router.currentRoute.path != '/login') {
            router.push('/')
            alert('令牌过期，请先登录')
          }
      }
    }
  }
)

Vue.prototype.$axios = axios
Vue.prototype.$url = url

// Vue.use(Vuex);

/* eslint-disable no-new */
// new Vue({
//   el: "#app",
//   router,
//   store,
//   components: { testLayout },
//   template: "<testLayout/>"
// });

//runtime

new Vue({
  router,
  store,
  render: h => h(testLayout)
}).$mount('#app')
