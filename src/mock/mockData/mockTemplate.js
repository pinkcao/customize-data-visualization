import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

// const screenDef = [
//   {
//     index: 0,
//     title: '页面宽度: ',
//     type: 'inputNumber',
//     value: 1536
//   },
//   {
//     index: 1,
//     title: '页面高度: ',
//     type: 'inputNumber',
//     value: 864
//   }
// ]
const errorString = 'cannot find certain template'

const templateList = [
  {
    templateID: 1,
    templatePicUrl: '',
    screenDef: [
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
    ],
    screenStretch: {
      allStretch: true,
      yStretch: false,
      xStretch: false,
      noStretch: false
    }
  },
  {
    templateID: 2,
    templatePicUrl: '',
    screenDef: [
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
    ],
    screenStretch: {
      allStretch: true,
      yStretch: false,
      xStretch: false,
      noStretch: false
    }
  },
  {
    templateID: 3,
    templatePicUrl: '',
    screenDef: [
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
    ],
    screenStretch: {
      allStretch: true,
      yStretch: false,
      xStretch: false,
      noStretch: false
    }
  }
]

const screenStretch = {
  allStretch: true,
  yStretch: false,
  xStretch: false,
  noStretch: false
}

export default {
  getScreenDef: Mock.mock(url.getScreenDef, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].templateID == currentTemplateID) {
        return templateList[i].screenDef
      }
    }
    return errorString
    // return screenDef
  }),
  updateScreenDef: Mock.mock(url.updateScreenDef, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let tempScreenDef = JSON.parse(params.body).screenDef
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].templateID == currentTemplateID) {
        console.log(templateList[i].screenDef)
        for (let j = 0; j < templateList[i].screenDef.length; j++) {
          console.log(templateList[i].screenDef[j])
          console.log(tempScreenDef)
          console.log(tempScreenDef[j])
          templateList[i].screenDef[j] = tempScreenDef[j]
        }
        return templateList[i].screenDef
      }
    }
    return errorString
  }),
  getScreenStretch: Mock.mock(url.getScreenStretch, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].templateID == currentTemplateID) {
        return templateList[i].screenStretch
      }
    }
    return errorString
  }),
  updateScreenStretch: Mock.mock(url.updateScreenStretch, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let tempScreenStretch = JSON.parse(params.body).screenStretch
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].templateID == currentTemplateID) {
        templateList[i].screenStretch.allStretch = tempScreenStretch.allStretch
        templateList[i].screenStretch.yStretch = tempScreenStretch.yStretch
        templateList[i].screenStretch.xStretch = tempScreenStretch.xStretch
        templateList[i].screenStretch.noStretch = tempScreenStretch.noStretch
        return templateList[i].screenStretch
      }
    }
    return errorString
  }),
  getTemplateList: Mock.mock(url.getTemplateList, 'post', params => {
    console.log(JSON.parse(params.body))
    let userID = JSON.parse(params.body)
    if (userID != null) {
      return templateList
    }
  })
}
