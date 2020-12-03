import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    componentNameToCanvas: '',
    componentUid: '',
    componentActive: [],
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
    },
    appendComponent(state, properties) {
      properties.index = state.componentList.length
      state.componentList.push(properties)
      console.log(properties)
    },
    initActiveComponent(state, componentList) {
      for (let i = 0; i < componentList.length; i++) {
        // state.componentActive.push({ active: componentList[i].active })
        state.componentActive[componentList[i].index] = { active: componentList[i].active }
      }
    },
    updateActiveComponent(state, args) {
      // console.log(args)
      let componentList = args.componentList
      let index = args.index
      for (let i = 0; i < componentList.length; i++) {
        state.componentActive[componentList[i].index] = { active: false }
      }
      state.componentActive[index].active = true
    },
    setActiveComponentFalse(state) {
      for (let i = 0; i < state.componentActive.length; i++) {
        state.componentActive[i].active = false
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
