import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import url from '../mock/mockAPI.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    componentNameToCanvas: '',
    componentUid: '',
    componentActive: [],
    componentList: [],
    //修正canvas规模、鼠标倍率
    parentScale: 0.35,
    parentScaleX: 0.35,
    parentScaleY: 0.35,
    parentW: 1536, //这个调的时候记得+px
    parentH: 864,
    position: 'absolute',
    colDef: [
      {
        index: 0,
        title: '页面宽度: ',
        type: 'inputNumber',
        value: 1536
      },
      {
        index: 1,
        title: '页面高度: ',
        type: 'inputNumber',
        value: 864
      }
    ]
  },
  mutations: {
    changeComponentNameToCanvas(state, compName) {
      state.componentNameToCanvas = compName
    },
    changeComponentUid(state, uid) {
      state.componentUid = uid
    },
    //这两个方法以备不时之需，目前不需要
    // adjustComponent(state, propertyObj) {
    //   for (let i = 0; i < state.componentList.length; i++) {
    //     if (propertyObj.index == state.componentList[i].index) {
    //       state.componentList[i].width = propertyObj.width
    //       state.componentList[i].height = propertyObj.height
    //       state.componentList[i].top = propertyObj.top
    //       state.componentList[i].left = propertyObj.left
    //     }
    //   }
    // },
    // appendComponent(state, properties) {
    //   properties.index = state.componentList.length
    //   state.componentList.push(properties)
    //   console.log(properties)
    // },
    //初始化组件列表
    initComponentList(state, componentList) {
      state.componentList = componentList
      // console.log(state.componentList)
    },
    //初始化活跃组件列表
    initActiveComponent(state, componentList) {
      for (let i = 0; i < componentList.length; i++) {
        // state.componentActive.push({ active: componentList[i].active })
        state.componentActive[componentList[i].index] = { active: componentList[i].active }
      }
    },
    //设置所有组件为不活跃，设置被选中组件为活跃
    updateActiveComponent(state, args) {
      // console.log(args)
      let componentList = args.componentList
      let index = args.index
      for (let i = 0; i < componentList.length; i++) {
        state.componentActive[componentList[i].index] = { active: false }
      }
      state.componentActive[index].active = true
    },
    //设置所有组件为不活跃
    setActiveComponentFalse(state) {
      for (let i = 0; i < state.componentActive.length; i++) {
        state.componentActive[i].active = false
      }
    },
    //传入排序后数组，给排序后数组的z-index重排序，升序
    updateAllZindexAsc(state, componentList) {
      state.componentList = componentList
      for (let i = 0; i < state.componentList.length; i++) {
        state.componentList[i].zindex = i
      }
      axios({
        url: url.updateZindexComponentList,
        method: 'post',
        data: componentList
      }).then(res => {
        console.log(res.data.resultSet)
      })
    },
    //传入排序后数组，给排序后数组的z-index重排序，降序
    updateAllZindexDsc(state, componentList) {
      state.componentList = componentList
      for (let i = 0; i < state.componentList.length; i++) {
        state.componentList[i].zindex = 100000 - i
      }
      axios({
        url: url.updateZindexComponentList,
        method: 'post',
        data: componentList
      }).then(res => {
        console.log(res.data.resultSet)
      })
    },
    updatePageValue(state, data) {
      for (let i = 0; i < state.colDef.length; i++) {
        if (state.colDef[i].index == data.index) {
          state.colDef[i].value = data.value
          // console.log(state.colDef[i].value)
          break
        }
      }
    }
  },

  getters: {},

  actions: {},
  modules: {}
})
