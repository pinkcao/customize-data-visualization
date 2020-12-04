import Mock from 'mockjs'
import url from './mockAPI.js'
import axios from 'axios'

const componentTabData = [
  {
    classname: 'el-icon-date',
    showData: [
      {
        vshow: true,
        text: 'ofctesttext1',
        componentdetail: [
          {
            title: '组件a',
            name: 'compA',
            picurl: require('../assets/柱状图组件.png')
          },
          {
            title: '组件b',
            name: 'compB'
          }
        ]
      },
      {
        vshow: false,
        text: 'ofctesttext2',
        componentdetail: [
          {
            title: '组件d',
            name: 'compD'
          },
          {
            title: '组件e',
            name: 'compE'
          },
          {
            title: '组件f',
            name: 'compF'
          }
        ]
      }
    ]
  },
  {
    classname: 'el-icon-camera',
    showData: [
      {
        vshow: false,
        text: 'ofctesttext3',
        componentdetail: [
          {
            title: '组件g',
            name: 'compG'
          }
        ]
      },
      {
        vshow: false,
        text: 'ofctesttext4',
        componentdetail: [
          {
            title: '组件h',
            name: 'compH'
          }
        ]
      }
    ]
  }
]

const componentList = [
  {
    name: 'compA',
    title: 'title',
    subTitle: 'subtitle',
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
    dataSource: [
      ['department', '2018', '2019', '2020', '2021', '2022'],
      ['finance', 43.3, 85.8, 93.7, 55.4, 66.7],
      ['humanResource', 83.1, 73.4, 55.1, 77.3, 26.4],
      ['sales', 86.4, 65.2, 82.5, 41.5, 57.6],
      ['product', 72.4, 53.9, 39.1, 14.8, 25.9],
      ['qualityAssurance', 55.1, 66.5, 46.8, 34.8, 66.4]
    ]
  },
  {
    name: 'compA',
    title: 'title',
    subTitle: 'subtitle',
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
    dataSource: [
      ['department', '2018', '2019', '2020', '2021'],
      ['finance', 43.3, 85.8, 93.7, 55.4],
      ['humanResource', 83.1, 73.4, 55.1, 77.3],
      ['sales', 86.4, 65.2, 82.5, 41.5],
      ['product', 72.4, 53.9, 39.1, 14.8],
      ['qualityAssurance', 55.1, 66.5, 46.8, 34.8]
    ]
  }
]

console.log('mock服务加载')

export default {
  tabData: Mock.mock(url.tabData, 'post', () => {
    return {
      status: 200,
      message: '获取成功',
      resultSet: componentTabData
    }
  }),
  getComponentList: Mock.mock(url.getComponentList, 'post', () => {
    return {
      status: 200,
      message: '获取成功',
      resultSet: componentList
    }
  }),
  appendComponentList: Mock.mock(url.appendComponentList, 'post', newComp => {
    componentList.push(JSON.parse(newComp.body))
    componentList[componentList.length - 1].index = componentList.length - 1
    return {
      status: 200,
      message: '添加成功',
      resultSet: componentList
    }
  }),
  adjustComponentList: Mock.mock(url.adjustComponent, 'post', params => {
    // console.log(JSON.parse(params.body))
    let propertyObj = JSON.parse(params.body)
    for (let i = 0; i < componentList.length; i++) {
      if (propertyObj.index == componentList[i].index) {
        componentList[i].width = propertyObj.width
        componentList[i].height = propertyObj.height
        componentList[i].top = propertyObj.top
        componentList[i].left = propertyObj.left
      }
    }
    return {
      status: 200,
      message: '更新成功',
      resultSet: componentList
    }
  }),
  //只是将其可见性设为否
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
  updateZindexComponentList: Mock.mock(url.updateZindexComponentList, 'post', params => {
    let currentComponentList = JSON.parse(params.body)
    for (let i = 0; i < currentComponentList.length; i++) {
      componentList[i] = currentComponentList[i]
    }
    // componentList = currentComponentList
    // console.log(currentComponentList)
    return {
      status: 200,
      message: '修改z-index成功',
      resultSet: componentList
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
