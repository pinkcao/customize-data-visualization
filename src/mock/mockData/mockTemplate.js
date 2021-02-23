import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

// function checkDuplicateAccount(account) {
//   return age >= 18;
// }

const errorString = 'cannot find certain template'

const userList = [
  {
    userAccount: 'admin',
    userPassword: 'd033e22ae348aeb5660fc2140aec35850c4da997',
    userEmail: 'notacertainaddress@gmail.com',
    userID: 1,
    disabled: false
  },
  {
    userAccount: 'test',
    userPassword: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
    userEmail: 'notacertainaddress@gmail.com',
    userID: 2,
    disabled: false
  }
]

const templateList = [
  {
    userID: 1,
    userTemplate: [
      {
        templateID: 1,
        templatePicUrl: '',
        disabled: false,
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
        },
        backgroundStyle: {
          backgroundColor: '#0e2a43',
          backgroundImage: ''
        }
      },
      {
        templateID: 2,
        templatePicUrl: '',
        disabled: false,
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
        },
        backgroundStyle: {
          backgroundColor: '#0e2a43',
          backgroundImage: ''
        }
      },
      {
        templateID: 3,
        templatePicUrl: '',
        disabled: false,
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
        },
        backgroundStyle: {
          backgroundColor: '#0e2a43',
          backgroundImage: ''
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
        disabled: false,
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
        },
        backgroundStyle: {
          backgroundColor: '#0e2a43',
          backgroundImage: ''
        }
      },
      {
        templateID: 5,
        templatePicUrl: '',
        disabled: false,
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
        },
        backgroundStyle: {
          backgroundColor: '#0e2a43',
          backgroundImage: ''
        }
      },
      {
        templateID: 6,
        templatePicUrl: '',
        disabled: false,
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
        },
        backgroundStyle: {
          backgroundColor: '#0e2a43',
          backgroundImage: ''
        }
      }
    ]
  }
]

let lastTemplateID = 6

let lastUserID = 2

const componentList = [
  {
    templateID: 1,
    components: [
      {
        name: 'graphComponent',
        title: '主标题',
        subTitle: '副标题',
        width: 400,
        height: 300,
        top: 10,
        left: 10,
        deg: 0,
        draggable: true,
        resizable: true,
        parentLimitation: true,
        active: false,
        ifshow: true,
        index: 0,
        zindex: 0,
        dataSource: {
          data: [
            ['department', '2018', '2019', '2020', '2021', '2022'],
            ['finance', 43.3, 85.8, 93.7, 55.4, 66.7],
            ['humanResource', 83.1, 73.4, 55.1, 77.3, 26.4],
            ['sales', 86.4, 65.2, 82.5, 41.5, 57.6],
            ['product', 72.4, 53.9, 39.1, 14.8, 25.9],
            ['qualityAssurance', 55.1, 66.5, 46.8, 34.8, 66.4]
          ],
          dataSourceOptions: [
            {
              value: 'APISource',
              label: 'API数据源'
            },
            {
              value: 'otherSource',
              label: 'unknown'
            }
          ],
          dataSourceType: '',
          APISwitch: false,
          APIURL: '',
          APIMethod: '',
          APIInterval: 10000,
          APIHeader: '',
          IntervalID: 0
        },
        style: {
          opacity: 1,
          legendvis: true,
          titlevis: true,
          titlepos: 'center'
        }
      },
      {
        name: 'graphComponent',
        title: 'mainTitle',
        subTitle: 'subTitle',
        width: 300,
        height: 300,
        top: 500,
        left: 100,
        deg: 0,
        draggable: true,
        resizable: true,
        parentLimitation: true,
        active: false,
        ifshow: true,
        index: 1,
        zindex: 1,
        dataSource: {
          data: [
            ['department', '2018', '2019', '2020', '2021'],
            ['finance', 43.3, 85.8, 93.7, 55.4],
            ['humanResource', 83.1, 73.4, 55.1, 77.3],
            ['sales', 86.4, 65.2, 82.5, 41.5],
            ['product', 72.4, 53.9, 39.1, 14.8],
            ['qualityAssurance', 55.1, 66.5, 46.8, 34.8]
          ],
          dataSourceOptions: [
            {
              value: 'APISource',
              label: 'API数据源'
            },
            {
              value: 'otherSource',
              label: 'unknown'
            }
          ],
          dataSourceType: '',
          APISwitch: false,
          APIURL: '',
          APIMethod: '',
          APIInterval: 10000,
          APIHeader: '',
          IntervalID: 0
        },
        style: {
          opacity: 1,
          legendvis: true,
          titlevis: true,
          titlepos: 'center'
        }
      }
    ]
  },
  {
    templateID: 2,
    components: []
  },
  {
    templateID: 3,
    components: []
  },
  {
    templateID: 4,
    components: []
  },
  {
    templateID: 5,
    components: []
  },
  {
    templateID: 6,
    components: []
  }
]

export default {
  getBackgroundStyle: Mock.mock(url.getBackgroundStyle, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let currentUserID = JSON.parse(params.body).userID
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].userID == currentUserID) {
        for (let j = 0; j < templateList[i].userTemplate.length; j++) {
          if (templateList[i].userTemplate[j].templateID == currentTemplateID) {
            return templateList[i].userTemplate[j].backgroundStyle
          }
        }
      }
    }
    return errorString
  }),
  updateBackgroundStyle: Mock.mock(url.updateBackgroundStyle, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let currentUserID = JSON.parse(params.body).userID
    let tempBackgroundStyle = JSON.parse(params.body).backgroundStyle
    for (let i = 0; i < templateList.length; i++) {
      if (templateList[i].userID == currentUserID) {
        for (let j = 0; j < templateList[i].userTemplate.length; j++) {
          if (templateList[i].userTemplate[j].templateID == currentTemplateID) {
            for (let k = 0; k < templateList[i].userTemplate[j].screenDef.length; k++) {
              templateList[i].userTemplate[j].backgroundStyle = tempBackgroundStyle
            }
            return templateList[i].userTemplate[j].backgroundStyle
          }
        }
      }
    }
    return errorString
  }),
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
  }),
  appendTemplate: Mock.mock(url.appendTemplate, 'post', params => {
    let userID = JSON.parse(params.body).userID
    for (let i = 0; i < templateList.length; i++) {
      if (userID == templateList[i].userID) {
        lastTemplateID += 1
        let template = {
          templateID: lastTemplateID,
          templatePicUrl: '',
          screenDef: [
            {
              index: 0,
              title: '页面宽度: ',
              type: 'inputNumber',
              value: 1920
            },
            {
              index: 1,
              title: '页面高度: ',
              type: 'inputNumber',
              value: 1080
            }
          ],
          screenStretch: {
            allStretch: true,
            yStretch: false,
            xStretch: false,
            noStretch: false
          },
          backgroundStyle: {
            backgroundColor: '#0e2a43',
            backgroundImage: ''
          }
        }
        templateList[i].userTemplate.push(template)
        let templateDetail = {
          templateID: lastTemplateID,
          components: []
        }
        componentList.push(templateDetail)
        // console.log(templateList[i].userTemplate)
        return templateList[i].userTemplate
      }
    }
  }),
  spliceTemplate: Mock.mock(url.spliceTemplate, 'post', params => {
    let userID = JSON.parse(params.body).userID
    let currentTemplateID = JSON.parse(params.body).templateID
    for (let i = 0; i < templateList.length; i++) {
      if (userID == templateList[i].userID) {
        for (let j = 0; j < templateList[i].userTemplate.length; j++) {
          if (currentTemplateID == templateList[i].userTemplate[j].templateID) {
            // templateList[i].userTemplate.splice(j, 1)
            templateList[i].userTemplate[j].disabled = true
            // console.log(templateList[i].userTemplate)
            return templateList[i].userTemplate
          }
        }
      }
    }
    return 'userID或者templateID有问题'
  }),
  //获取当前componentList
  getComponentList: Mock.mock(url.getComponentList, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    // console.log(currentTemplateID)
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].templateID == currentTemplateID) {
        return {
          message: '获取成功',
          resultSet: componentList[i].components
        }
      }
    }
  }),
  //添加组件并设置其index值为当前数组长度
  appendComponentList: Mock.mock(url.appendComponentList, 'post', newComp => {
    let currentTemplateID = JSON.parse(newComp.body).templateID
    let component = JSON.parse(newComp.body)
    // console.log(component)
    delete component['templateID']
    // console.log(component)
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].templateID == currentTemplateID) {
        componentList[i].components.push(component)
        // eslint-disable-next-line prettier/prettier
        componentList[i].components[componentList[i].components.length - 1].index =
          componentList[i].components.length - 1
        return {
          message: '添加成功',
          resultSet: componentList[i].components
        }
      }
    }
  }),
  //每当组件进行缩放、位移进行调用，更新当前组件的的属性
  adjustComponentList: Mock.mock(url.adjustComponent, 'post', params => {
    // console.log(JSON.parse(params.body))
    let propertyObj = JSON.parse(params.body)
    let currentTemplateID = JSON.parse(params.body).templateID
    // console.log(propertyObj)
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].templateID == currentTemplateID) {
        // console.log('right')
        for (let j = 0; j < componentList[i].components.length; j++) {
          // console.log(componentList[i].components[j].index, propertyObj.index)
          if (propertyObj.index == componentList[i].components[j].index) {
            componentList[i].components[j].width = propertyObj.width
            componentList[i].components[j].height = propertyObj.height
            componentList[i].components[j].top = propertyObj.top
            componentList[i].components[j].left = propertyObj.left
            componentList[i].components[j].deg = propertyObj.deg
            console.log(propertyObj)
            console.log(componentList[i].components)
            return {
              message: '更新成功',
              resultSet: componentList[i].components
            }
          }
        }
      }
    }
    return {
      message: '更新失败'
    }
  }),
  //删除组件，只是将其可见性设为否
  spliceComponentList: Mock.mock(url.spliceComponentList, 'post', params => {
    let index = JSON.parse(params.body).index
    let currentTemplateID = JSON.parse(params.body).templateID
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].templateID == currentTemplateID) {
        for (let j = 0; j < componentList[i].components.length; j++) {
          if (index == componentList[i].components[j].index) {
            componentList[i].components[j].ifshow = false
            return {
              message: '删除成功',
              resultSet: componentList[i].components
            }
          }
        }
      }
    }
    return {
      message: '删除失败',
      resultSet: componentList
    }
  }),
  //更新所有组件的z-index值使其与设计界面z-index值相等
  //实际上这里是直接复制了传入的componentList
  updateZindexComponentList: Mock.mock(url.updateZindexComponentList, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let currentComponentList = JSON.parse(params.body).componentList
    // console.log(currentComponentList)
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].templateID == currentTemplateID) {
        for (let j = 0; j < componentList[i].components.length; j++) {
          componentList[i].components[j] = currentComponentList[j]
          // console.log(componentList[i].components.length)
          // console.log(currentComponentList[j])
        }
        return {
          message: '修改z-index成功',
          resultSet: componentList[i].components
        }
      }
    }
    return {
      message: '修改z-index失败',
      resultSet: componentList[i].components
    }
  }),
  updateComponentBasicStatus: Mock.mock(url.updateComponentBasicStatus, 'post', params => {
    let currentTemplateID = JSON.parse(params.body).templateID
    let args = JSON.parse(params.body)
    let index = args.index
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].templateID == currentTemplateID) {
        for (let j = 0; j < componentList[i].components.length; j++) {
          if (componentList[i].components[j].index == index) {
            componentList[i].components[j].dataSource = args.dataSource
            // componentList[i].components[j].width = args.width
            // componentList[i].components[j].height = args.height
            // componentList[i].components[j].left = args.left
            // componentList[i].components[j].top = args.top
            componentList[i].components[j].style = args.style
            componentList[i].components[j].title = args.title
            componentList[i].components[j].subTitle = args.subTitle
            return {
              message: '修改组件数据成功',
              resultSet: componentList[i].components
            }
          }
        }
      }
    }
    return {
      message: '修改组件数据失败'
    }
  }),
  userLogin: Mock.mock(url.userLogin, 'post', params => {
    let args = JSON.parse(params.body)
    for (let i = 0; i < userList.length; i++) {
      if (args.account == userList[i].userAccount && args.password == userList[i].userPassword) {
        return {
          loginStatus: true,
          userID: userList[i].userID
        }
      }
    }
    return {
      loginStatus: false
    }
  }),
  userRegister: Mock.mock(url.userRegister, 'post', params => {
    let userInfo = JSON.parse(params.body)
    let tempAccountArr = []
    for (let i = 0; i < userList.length; i++) {
      tempAccountArr.push(userList[i].userAccount)
    }
    if (tempAccountArr.find(item => item == userInfo.userAccount) == undefined) {
      lastUserID += 1
      userList.push({
        userAccount: userInfo.userAccount,
        userPassword: userInfo.userPassword,
        userEmail: userInfo.userEmail,
        userID: lastUserID,
        disabled: false
      })
      templateList.push({
        userID: lastUserID,
        userTemplate: []
      })
      return {
        registerStatus: true,
        userInfo: userList[userList.length - 1]
      }
    }
    return {
      registerStatus: false
    }
  }),
  validateAccount: Mock.mock(url.validateAccount, 'post', params => {
    let userAccount = JSON.parse(params.body).account
    let tempAccountArr = []
    for (let i = 0; i < userList.length; i++) {
      tempAccountArr.push(userList[i].userAccount)
    }
    if (tempAccountArr.find(item => item == userAccount) == undefined) {
      return true
    }
    return false
  })
}
