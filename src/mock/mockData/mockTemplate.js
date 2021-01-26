import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

const screenDef = [
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

const templateList = [
  {
    templateID: 1,
    templatePicUrl: ''
  },
  {
    templateID: 2,
    templatePicUrl: ''
  },
  {
    templateID: 3,
    templatePicUrl: ''
  }
]

const screenStretch = {
  allStretch: true,
  yStretch: false,
  xStretch: false,
  noStretch: false
}

export default {
  getScreenDef: Mock.mock(url.getScreenDef, 'post', () => {
    return screenDef
  }),
  updateScreenDef: Mock.mock(url.updateScreenDef, 'post', params => {
    let tempScreenDef = JSON.parse(params.body)
    // console.log(JSON.parse(params.body))
    for (let i = 0; i < screenDef.length; i++) {
      screenDef[i] = tempScreenDef[i]
    }
    return screenDef
  }),
  getScreenStretch: Mock.mock(url.getScreenStretch, 'post', () => {
    return screenStretch
  }),
  updateScreenStretch: Mock.mock(url.updateScreenStretch, 'post', params => {
    let tempScreenStretch = JSON.parse(params.body)
    screenStretch.allStretch = tempScreenStretch.allStretch
    screenStretch.yStretch = tempScreenStretch.yStretch
    screenStretch.xStretch = tempScreenStretch.xStretch
    screenStretch.noStretch = tempScreenStretch.noStretch
    return screenStretch
  }),
  updateScreenStretch: Mock.mock(url.updateScreenStretch, 'post', params => {
    let tempScreenStretch = JSON.parse(params.body)
    screenStretch.allStretch = tempScreenStretch.allStretch
    screenStretch.yStretch = tempScreenStretch.yStretch
    screenStretch.xStretch = tempScreenStretch.xStretch
    screenStretch.noStretch = tempScreenStretch.noStretch
    return screenStretch
  }),
  getTemplateList: Mock.mock(url.getTemplateList, 'post', params => {
    console.log(JSON.parse(params.body))
    let userID = JSON.parse(params.body)
    if (userID != null) {
      return templateList
    }
  })
}
