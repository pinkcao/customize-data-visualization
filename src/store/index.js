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
        width: 800,
        height: 600,
        top: 10,
        left: 10,
        draggable: true,
        resizable: true,
        parentLimitation: true,
        active: false,
        ifshow: false,
        index: 0,
        dataSource: [
          ['department', '2018', '2019', '2020', '2021', '2022'],
          ['finance', 43.3, 85.8, 93.7, 55.4, 66.7],
          ['humanResource', 83.1, 73.4, 55.1, 77.3, 26.4],
          ['sales', 86.4, 65.2, 82.5, 41.5, 57.6],
          ['product', 72.4, 53.9, 39.1, 14.8, 25.9],
          ['qualityAssurance', 55.1, 66.5, 46.8, 34.8, 66.4]
        ]
        // preventActiveBehavior:
      },
      {
        name: 'compA',
        width: 300,
        height: 300,
        top: 500,
        left: 500,
        draggable: true,
        resizable: true,
        parentLimitation: true,
        active: false,
        ifshow: false,
        index: 1,
        dataSource: [
          ['department', '2018', '2019', '2020', '2021'],
          ['finance', 43.3, 85.8, 93.7, 55.4],
          ['humanResource', 83.1, 73.4, 55.1, 77.3],
          ['sales', 86.4, 65.2, 82.5, 41.5],
          ['product', 72.4, 53.9, 39.1, 14.8],
          ['qualityAssurance', 55.1, 66.5, 46.8, 34.8]
        ]
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
