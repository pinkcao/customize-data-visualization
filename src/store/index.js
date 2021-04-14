import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import url from '@mock/mockAPI.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    componentNameToCanvas: '',
    componentActive: [],
    componentList: [],
    pageAndComponentFlag: true,
    activeComponentIndex: -1,
    currentComponent: [],
    componentActiveFlag: false,
    //修正canvas规模
    parentScale: 0.45,
    //修正鼠标移动倍率
    parentScaleX: 0.45,
    parentScaleY: 0.45,
    position: 'absolute',
    currentColWidth: 0,

    screenDef: [],
    screenDefFlag: false,
    screenStretchFlag: false,
    backgroundStyleFlag: false,
    allStretch: true,
    yStretch: false,
    xStretch: false,
    noStretch: false,
    backgroundStyle: {
      backgroundColor: '',
      backgroundImage: ''
    },

    currentUserID: -1,
    currentTemplateID: -1,
    reloadFlag: false
  },
  mutations: {
    changeReloadFlag(state, reloadFlag) {
      if (reloadFlag) {
        state.reloadFlag = reloadFlag
      }
    },
    resetReloadFlag(state) {
      state.reloadFlag = false
    },
    changeCurrentTemplateID(state, templateID) {
      if (templateID >= 0) {
        state.currentTemplateID = templateID
      }
    },

    changeCurrentUserID(state, userID) {
      if (userID >= 0) {
        state.currentUserID = userID
        // console.log(state.currentUserID)
      }
    },
    //获取当前组件的name
    changeComponentNameToCanvas(state, compName) {
      state.componentNameToCanvas = compName
    },
    //初始化flag
    initScreenFlags(state) {
      state.screenDefFlag = false
      state.screenStretchFlag = false
      state.backgroundStyleFlag = false
    },
    //初始化界面设置
    initScreenDef(state, screenDef) {
      state.screenDef = screenDef
      state.screenDefFlag = true
    },
    initScreenStretch(state, screenStretch) {
      // console.log(screenStretch)
      state.allStretch = screenStretch.allStretch
      state.yStretch = screenStretch.yStretch
      state.xStretch = screenStretch.xStretch
      state.noStretch = screenStretch.noStretch
      state.screenStretchFlag = true
    },
    initBackgroundStyle(state, backgroundStyle) {
      state.backgroundStyle = backgroundStyle
      state.backgroundStyleFlag = true
      console.log(state.backgroundStyle)
    },
    updateBackgroundStyle(state, backgroundStyle) {
      state.backgroundStyle = backgroundStyle
      console.log(state.backgroundStyle)
    },
    updateStretch(state, stretch) {
      switch (stretch) {
        case 'allStretch':
          state.allStretch = true
          state.yStretch = false
          state.xStretch = false
          state.noStretch = false
          break
        case 'xStretch':
          state.allStretch = false
          state.yStretch = false
          state.xStretch = true
          state.noStretch = false
          break
        case 'yStretch':
          state.allStretch = false
          state.yStretch = true
          state.xStretch = false
          state.noStretch = false
          break
        case 'noStretch':
          state.allStretch = false
          state.yStretch = false
          state.xStretch = false
          state.noStretch = true
          break
      }
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
    },
    //更新当前页的宽与高
    updatePageValue(state, data) {
      for (let i = 0; i < state.screenDef.length; i++) {
        if (state.screenDef[i].index == data.index) {
          state.screenDef[i].value = data.value
          break
        }
      }
      // console.log(state.screenDef)
    },
    //更新当前页面规模,
    updateCurrentColWidth(state, data) {
      state.currentColWidth = 0
      for (let i = 0; i < data.length; i++) {
        state.currentColWidth += data[i]
      }
      // this.updateParentScale()
    },
    //更新全局的规模
    updateParentScale(state) {
      console.log(state.screenDef)
      if (state.screenDef != []) {
        //使用当前屏幕的宽度来计算目前的画布所应有的Scale
        let currentWidth = window.screen.width
        currentWidth -= state.currentColWidth
        let newScale = currentWidth / state.screenDef[0].value
        state.parentScale = newScale
        state.parentScaleX = newScale
        state.parentScaleY = newScale
      }
      // state.currentColWidth = 0
      // for (let i = 0; i < data.length; i++) {
      //   currentWidth = currentWidth - data[i]
      //   //currentColWidth用于在不调整整个页面布局，但显示页面宽高变化时进行页面的自适应变化
      //   state.currentColWidth = state.currentColWidth + data[i]
      // }
      // let newScale = currentWidth / state.screenDef[0].value
      // state.parentScale = newScale
      // state.parentScaleX = newScale
      // state.parentScaleY = newScale
    }
  },

  getters: {},

  actions: {},
  modules: {}
})
