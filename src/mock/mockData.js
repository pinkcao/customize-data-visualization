import Mock from 'mockjs'
import url from './mockAPI.js'

export default {
  tabData: Mock.mock(url.tabData, 'post', () => {
    console.log('mock服务加载')
    return {
      status: 200,
      message: '获取成功',
      resultSet: [
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
    }
  })
}
