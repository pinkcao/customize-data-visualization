import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    componentNameToCanvas: '',
    componentUid: '',
    componentList: [
      {
      name: 'compA',
      width: 200,
      height: 150,
      top: 10,
      left: 10,
      draggable: true,
      resizable: true,
      parentLimitation: true,
      active: false,
      ifshow: false,
      index: 0,
    },
    {
      name: 'compA',
      width: 100,
      height: 150,
      top: 500,
      left: 500,
      draggable: true,
      resizable: true,
      parentLimitation: true,
      active: false,
      ifshow: false,
      index: 1,
    },
    ],
    parentScaleX :0.3,
    parentScaleY :0.3,
    parentScale :0.3,
    parentW :1920,
    parentH :1080,
  },
  mutations: {
    changeLogin(state, isOK) {
      state.isLogin = isOK;
    },

    changeComponentNameToCanvas(state, compName) {
      state.componentNameToCanvas = compName;
    },

    changeComponentUid(state, uid) {
      state.componentUid = uid;
    },
  },


  getters: {
    getIsLogin(state) {
      return state.isLogin;
    },

  },

  actions: {},
  modules: {}
})
