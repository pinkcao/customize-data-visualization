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
        index: 0
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
        index: 1
      }
    ],
    //修正canvas规模、鼠标倍率
    parentScale: 0.35,
    parentW: 1536, //这个调的时候记得+px
    parentH: 864,
    position: 'absolute'
  },
  mutations: {
    changeLogin(state, isOK) {
      state.isLogin = isOK
    },

    changeComponentNameToCanvas(state, compName) {
      state.componentNameToCanvas = compName
    },

    changeComponentUid(state, uid) {
      state.componentUid = uid
    },
    adjustComponent(state, propertyObj) {
      for (let i = 0; i < state.componentList.length; i++) {
        if (propertyObj.index == state.componentList[i].index) {
          state.componentList[i].width = propertyObj.width
          state.componentList[i].height = propertyObj.height
          state.componentList[i].top = propertyObj.top
          state.componentList[i].left = propertyObj.left
        }
      }
    }
  },

  getters: {
    getIsLogin(state) {
      return state.isLogin
    }
  },

  actions: {},
  modules: {}
})
