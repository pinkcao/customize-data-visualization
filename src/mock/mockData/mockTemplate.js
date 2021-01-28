import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

const errorString = 'cannot find certain template'

const templateList = [
  {
    userID: 1,
    userTemplate: [
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
  },
  {
    userID: 2,
    userTemplate: [
      {
        templateID: 4,
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
        templateID: 5,
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
        templateID: 6,
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
  }
]

export default {
  getScreenDef: Mock.mock(url.getScreenDef, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let currentUserID = JSON.parse(params.body).userID
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].userID == currentUserID) {
        for (let j = 0; j < templateList[i].userTemplate.length; j++) {
          if (templateList[i].userTemplate[j].templateID == currentTemplateID) {
            return templateList[i].userTemplate[j].screenDef
          }
        }
      }
    }
    return errorString
  }),
  updateScreenDef: Mock.mock(url.updateScreenDef, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let currentUserID = JSON.parse(params.body).userID
    let tempScreenDef = JSON.parse(params.body).screenDef
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].userID == currentUserID) {
        for (let j = 0; j < templateList[i].userTemplate.length; j++) {
          if (templateList[i].userTemplate[j].templateID == currentTemplateID) {
            for (let k = 0; k < templateList[i].userTemplate[j].screenDef.length; k++) {
              templateList[i].userTemplate[j].screenDef[k] = tempScreenDef[k]
            }
            return templateList[i].userTemplate[j].screenDef
          }
        }
      }
    }
    return errorString
  }),
  getScreenStretch: Mock.mock(url.getScreenStretch, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let currentUserID = JSON.parse(params.body).userID
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].userID == currentUserID) {
        for (let j = 0; j < templateList[i].userTemplate.length; j++) {
          if (templateList[i].userTemplate[j].templateID == currentTemplateID) {
            return templateList[i].userTemplate[j].screenStretch
          }
        }
      }
    }
    return errorString
  }),
  updateScreenStretch: Mock.mock(url.updateScreenStretch, 'post', params => {
    let currentUserID = JSON.parse(params.body).userID
    let currentTemplateID = JSON.parse(params.body).templateID
    let tempScreenStretch = JSON.parse(params.body).screenStretch
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].userID == currentUserID) {
        for (let j = 0; j < templateList[i].userTemplate.length; j++) {
          if (templateList[i].userTemplate[j].templateID == currentTemplateID) {
            templateList[i].userTemplate[j].screenStretch.allStretch = tempScreenStretch.allStretch
            templateList[i].userTemplate[j].screenStretch.yStretch = tempScreenStretch.yStretch
            templateList[i].userTemplate[j].screenStretch.xStretch = tempScreenStretch.xStretch
            templateList[i].userTemplate[j].screenStretch.noStretch = tempScreenStretch.noStretch
            return templateList[i].userTemplate[j].screenStretch
          }
        }
      }
    }
    return errorString
  }),
  getTemplateList: Mock.mock(url.getTemplateList, 'post', params => {
    // console.log(JSON.parse(params.body))
    let userID = JSON.parse(params.body).userID
    for (let i = 0; i < templateList.length; i++) {
      // console.log(userID,templateList[i].userID)
      if (userID == templateList[i].userID) {
        console.log(templateList[i].userTemplate)
        return templateList[i].userTemplate
      }
    }
  })
}
