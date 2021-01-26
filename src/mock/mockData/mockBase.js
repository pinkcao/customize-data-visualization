import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

Mock.setup({
  timeout: '800-1200'
})

const user_account = 'admin'
const user_password = 'd033e22ae348aeb5660fc2140aec35850c4da997'

//默认初始tabdata
const componentTabData = [
  {
    className: 'el-icon-date',
    showData: [
      {
        vshow: true,
        text: '图表组件库',
        componentDetailList: [
          {
            title: '综合图表组件',
            componentName: 'graphComponent',
            picurl: require('@/assets/pics/图表组件.png')
          },
          {
            title: '漏斗图',
            componentName: 'funnelComponent',
            picurl: require('@/assets/pics/漏斗图.png')
          },
          {
            title: '极坐标柱状图',
            componentName: 'polarBarComponent',
            picurl: require('@/assets/pics/极坐标柱状图.png')
          },
          {
            title: 'K线图',
            componentName: 'kComponent',
            picurl: require('@/assets/pics/K线图.png')
          },
          {
            title: '雷达图',
            componentName: 'radarComponent',
            picurl: require('@/assets/pics/雷达图.png')
          }
        ]
      },
      {
        vshow: false,
        text: '子组件库B',
        componentDetailList: [
          {
            title: '组件d',
            componentName: 'titleComponent',
            picurl: require('@/assets/pics/文字组件.png')
          },
          {
            title: '组件e',
            componentName: 'compE',
            picurl: require('@/assets/pics/暂无.png')
          },
          {
            title: '组件f',
            componentName: 'compF',
            picurl: require('@/assets/pics/暂无.png')
          }
        ]
      }
    ]
  },
  {
    className: 'el-icon-camera',
    showData: [
      {
        vshow: false,
        text: '子组件库C',
        componentDetailList: [
          {
            title: '组件g',
            componentName: 'compG',
            picurl: require('@/assets/pics/暂无.png')
          }
        ]
      },
      {
        vshow: false,
        text: '子组件库D',
        componentDetailList: [
          {
            title: '组件h',
            componentName: 'compH',
            picurl: require('@/assets/pics/暂无.png')
          }
        ]
      }
    ]
  }
]
//默认初始挂载组件
const componentList = [
  {
    name: 'graphComponent',
    title: '主标题',
    subTitle: '副标题',
    width: 400,
    height: 300,
    top: 10,
    left: 10,
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
      deg: 0,
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
      deg: 0,
      titlepos: 'center'
    }
  }
]

console.log('mock服务加载')

export default {
  //获取组件列的tabData
  getComTabData: Mock.mock(url.getComTabData, 'post', () => {
    return {
      status: 200,
      message: '获取成功',
      resultSet: componentTabData
    }
  }),
  //获取当前componentList
  getComponentList: Mock.mock(url.getComponentList, 'post', () => {
    return {
      status: 200,
      message: '获取成功',
      resultSet: componentList
    }
  }),
  //添加组件并设置其index值为当前数组长度
  appendComponentList: Mock.mock(url.appendComponentList, 'post', newComp => {
    componentList.push(JSON.parse(newComp.body))
    componentList[componentList.length - 1].index = componentList.length - 1
    return {
      status: 200,
      message: '添加成功',
      resultSet: componentList
    }
  }),
  //每当组件进行缩放、位移进行调用，更新当前组件的的属性
  adjustComponentList: Mock.mock(url.adjustComponent, 'post', params => {
    // console.log(JSON.parse(params.body))
    let propertyObj = JSON.parse(params.body)
    for (let i = 0; i < componentList.length; i++) {
      if (propertyObj.index == componentList[i].index) {
        componentList[i].width = propertyObj.width
        componentList[i].height = propertyObj.height
        componentList[i].top = propertyObj.top
        componentList[i].left = propertyObj.left
        break
      }
    }
    return {
      status: 200,
      message: '更新成功',
      resultSet: componentList
    }
  }),
  //删除组件，只是将其可见性设为否
  spliceComponentList: Mock.mock(url.spliceComponentList, 'post', params => {
    let index = JSON.parse(params.body).index
    console.log(index)
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].index == index) {
        componentList[i].ifshow = false
      }
    }
    return {
      status: 200,
      message: '删除成功',
      resultSet: componentList
    }
  }),
  //更新所有组件的z-index值使其与设计界面z-index值相等
  //实际上这里是直接复制了传入的componentList
  updateZindexComponentList: Mock.mock(url.updateZindexComponentList, 'post', params => {
    let currentComponentList = JSON.parse(params.body)
    for (let i = 0; i < currentComponentList.length; i++) {
      componentList[i] = currentComponentList[i]
    }
    return {
      status: 200,
      message: '修改z-index成功',
      resultSet: componentList
    }
  }),
  updateComponentBasicStatus: Mock.mock(url.updateComponentBasicStatus, 'post', params => {
    let args = JSON.parse(params.body)
    let index = args.index
    // let dataSource = args.dataSource
    for (let i = 0; i < componentList.length; i++) {
      if (componentList[i].index == index) {
        componentList[i].dataSource = args.dataSource
        componentList[i].width = args.width
        componentList[i].height = args.height
        componentList[i].left = args.left
        componentList[i].top = args.top
        componentList[i].style = args.style
        componentList[i].title = args.title
        componentList[i].subTitle = args.subTitle
      }
    }
    // console.log(componentList)
    return {
      status: 200,
      message: '修改组件数据成功',
      resultSet: componentList
    }
  }),
  userLogin: Mock.mock(url.userLogin, 'post', params => {
    let args = JSON.parse(params.body)
    if (args.account == user_account && args.password == user_password) {
      return true
    } else {
      return false
    }
  })
  // getComponentListPromise: Mock.mock(url.getComponentListPromise, 'post', () => {
  //   return new Promise(function(resolve, reject) {
  //     this.$axios({
  //       url: url.getComponentListPromise,
  //       method: 'post',
  //       data: {}
  //     }).then(res => {
  //       if (res.status === 200) {
  //         resolve(res.resultSet)
  //       }
  //     })
  //   })
  // })
}
