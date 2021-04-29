//initial state
const state = () => ({
  componentNameToCanvas: '',
  componentActive: [],
  componentList: [],
  pageAndComponentFlag: true,
  activeComponentIndex: -1,
  currentComponent: [],
  componentActiveFlag: false
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
        // console.log(state.componentList[i].dataSource.dataSourceType)
        break
      }
    }
  },
  //更新当前组件style中内容
  updateStyle(state, style) {
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == state.activeComponentIndex) {
        state.componentList[i].style = style
        // console.log(state.componentList[i].style)
        break
      }
    }
  },
  //更新当前组件标题
  updateTitle(state, title) {
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == state.activeComponentIndex) {
        state.componentList[i].title = title
        break
      }
    }
  },
  //更新当前组件副标题
  updateSubTitle(state, subTitle) {
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == state.activeComponentIndex) {
        state.componentList[i].subTitle = subTitle
        break
      }
    }
  },
  //仅更新组件基础属性
  updateComponentStatus(state, currentComponentBaseStatus) {
    for (let i = 0; i < state.componentList.length; i++) {
      if (state.componentList[i].index == state.activeComponentIndex) {
        state.componentList[i].width = currentComponentBaseStatus.width
        state.componentList[i].height = currentComponentBaseStatus.height
        state.componentList[i].left = currentComponentBaseStatus.left
        state.componentList[i].top = currentComponentBaseStatus.top
        state.componentList[i].deg = currentComponentBaseStatus.deg
        // console.log(state.componentList[i])
        break
      }
    }
  },
  //初始化组件列表
  initComponentList(state, componentList) {
    state.componentList = componentList
    // console.log(state.componentList)
  },
  //初始化活跃组件列表
  initActiveComponent(state, componentList) {
    for (let i = 0; i < componentList.length; i++) {
      state.componentActive[componentList[i].index] = { active: componentList[i].active }
    }
    console.log(state.componentActive)
  },
  //设置所有组件为不活跃，设置被选中组件为活跃
  updateActiveComponent(state, args) {
    // let componentList = args.componentList
    let index = args.index
    for (let i = 0; i < state.componentList.length; i++) {
      state.componentActive[state.componentList[i].index] = { active: false }
    }
    state.componentActive[index].active = true
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
    // console.log(state.componentActive)
    // console.log(state.componentActive)
    for (let i = 0; i < state.componentActive.length; i++) {
      if (state.componentActive[i] != undefined) {
        state.componentActive[i].active = false
      }
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
    console.log(componentList)
    let tempComponentList = JSON.parse(JSON.stringify(componentList))
    for (let i = 0; i < tempComponentList.length; i++) {
      // console.log(tempComponentList[i].dataSource.data)
      tempComponentList[i].dataSource.data = JSON.stringify(tempComponentList[i].dataSource.data)
      tempComponentList[i].dataSource.dataSourceOptions = JSON.stringify(
        tempComponentList[i].dataSource.dataSourceOptions
      )
    }
    axios({
      url: url.updateZindexComponentList,
      method: 'post',
      data: {
        componentList: tempComponentList
        // templateID: state.currentTemplateID
      }
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
      data: {
        componentList: componentList,
        templateID: state.currentTemplateID
      }
    }).then(res => {
      // console.log(res.data.resultSet)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
