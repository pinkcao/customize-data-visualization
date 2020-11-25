// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
// import Vuex from 'vuex';
// import App from "./App";
import testLayout from "./layout/testLayout.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import VueAxios from "vue-axios";
import less from "less";
import formCreate from "@form-create/element-ui";
import store from "./store";
import VueDragResize from "vue-drag-resize";


Vue.use(ElementUI);
Vue.use(formCreate);
Vue.prototype.axios = axios;
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.use(less);
Vue.component("vue-drag-resize", VueDragResize);

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
}).$mount("#app")
