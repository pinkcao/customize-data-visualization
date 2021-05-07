//initial state
const state = () => ({
  componentNameToCanvas: '',
  componentList: [],
  pageAndComponentFlag: true,
  activeComponentIndex: -1,
  currentComponent: [],
  componentActiveFlag: false,
  updateZindexFlag: false
})

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  changeComponentNameToCanvas(state, compName) {
    state.componentNameToCanvas = compName
  },
  //更新组件dataSource中内容
  updateDataSource(state, dataSource) {
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == state.activeComponentIndex) {
        state.componentList[i].dataSource = dataSource
        break
      }
    }
  },
  //更新当前组件style中内容
  updateStyle(state, style) {
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == state.activeComponentIndex) {
        state.componentList[i].style = style
        break
      }
    }
  },
  //初始化组件列表
  initComponentList(state, componentList) {
    state.componentList = componentList
    // console.log(state.componentList)
  },
  //设置所有组件为不活跃，设置被选中组件为活跃
  updateActiveComponent(state, args) {
    // let componentList = args.componentList
    let index = args.index
    console.log(index)
    for (let i = 0; i < state.componentList.length; i++) {
      state.componentList[i].active = false
      if (index === state.componentList[i].index) {
        state.componentList[i].active = true
      }
    }
    state.pageAndComponentFlag = false
    state.activeComponentIndex = index
    state.componentActiveFlag = true
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == index) {
        state.currentComponent = state.componentList[i]
      }
    }
  },
  //设置所有组件为不活跃，设置被选中组件为活跃
  resetComponentActiveFlag(state, bool) {
    state.componentActiveFlag = bool
  },
  //当每个组件的基础属性变化时被调用，更新当前组件，响应至componentSet
  resizeUpdateActiveComponent(state) {
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == state.activeComponentIndex) {
        state.currentComponent = state.componentList[i]
      }
    }
  },
  //设置所有组件为不活跃
  setActiveComponentFalse(state) {
    for (let i = 0; i < state.componentList.length; i++) {
      state.componentList[i].active = false
    }
    state.pageAndComponentFlag = true
    state.activeComponentIndex = -1
  },
  //传入排序后数组，给排序后数组的z-index重排序，升序
  updateAllZindexAsc(state, componentList) {
    state.componentList = componentList
    for (let i = 0; i < state.componentList.length; i++) {
      state.componentList[i].zindex = i
    }
    state.updateZindexFlag = true
  },
  setUpdateZindexFlag(state, bool) {
    state.updateZindexFlag = bool
  },
  //传入排序后数组，给排序后数组的z-index重排序，降序
  updateAllZindexDsc(state, componentList) {
    state.componentList = componentList
    for (let i = 0; i < state.componentList.length; i++) {
      state.componentList[i].zindex = 100000 - i
    }
    state.updateZindexFlag = true
  },
  updateComponentByKey(state, partOfComponent) {
    let index = partOfComponent.index
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index === index) {
        for (let key in partOfComponent) {
          state.componentList[i][key] = partOfComponent[key]
        }
        break
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
