import Vue from 'vue'
import Vuex from 'vuex'
import template from './template/template'
import component from './component/component'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},

  getters: {},

  actions: {},
  modules: {
    template,
    component
  }
})
