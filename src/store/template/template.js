//initial state
const state = () => ({
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
  }
})

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  //初始化flag
  initScreenFlags(state) {
    state.screenDefFlag = false
    state.screenStretchFlag = false
    state.backgroundStyleFlag = false
  },

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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
