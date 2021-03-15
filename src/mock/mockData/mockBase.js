import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

Mock.setup({
  timeout: '80-120'
})
console.log('mock服务加载')

//默认初始tabdata
// const componentTabData = [
//   {
//     className: 'el-icon-date',
//     showData: [
//       {
//         vshow: true,
//         text: '图表组件库',
//         componentDetailList: [
//           {
//             title: '综合图表组件',
//             componentName: 'graphComponent',
//             picurl: require('@/assets/pics/图表组件.png')
//           },
//           {
//             title: '漏斗图',
//             componentName: 'funnelComponent',
//             picurl: require('@/assets/pics/漏斗图.png')
//           },
//           {
//             title: '极坐标柱状图',
//             componentName: 'polarBarComponent',
//             picurl: require('@/assets/pics/极坐标柱状图.png')
//           },
//           {
//             title: 'K线图',
//             componentName: 'kComponent',
//             picurl: require('@/assets/pics/K线图.png')
//           },
//           {
//             title: '雷达图',
//             componentName: 'radarComponent',
//             picurl: require('@/assets/pics/雷达图.png')
//           }
//         ]
//       },
//       {
//         vshow: false,
//         text: '子组件库B',
//         componentDetailList: [
//           {
//             title: '组件d',
//             componentName: 'titleComponent',
//             picurl: require('@/assets/pics/文字组件.png')
//           },
//           {
//             title: '组件e',
//             componentName: 'titleComponent',
//             picurl: require('@/assets/pics/暂无.png')
//           },
//           {
//             title: '组件f',
//             componentName: 'titleComponent',
//             picurl: require('@/assets/pics/暂无.png')
//           }
//         ]
//       }
//     ]
//   },
//   {
//     className: 'el-icon-camera',
//     showData: [
//       {
//         vshow: false,
//         text: '子组件库C',
//         componentDetailList: [
//           {
//             title: '组件g',
//             componentName: 'titleComponent',
//             picurl: require('@/assets/pics/暂无.png')
//           }
//         ]
//       },
//       {
//         vshow: false,
//         text: '子组件库D',
//         componentDetailList: [
//           {
//             title: '组件h',
//             componentName: 'titleComponent',
//             picurl: require('@/assets/pics/暂无.png')
//           }
//         ]
//       }
//     ]
//   }
// ]
//默认初始挂载组件

// export default {
//   //获取组件列的tabData
//   getComTabData: Mock.mock(url.getComTabData, 'post', () => {
//     return {
//       status: 200,
//       message: '获取成功',
//       resultSet: componentTabData
//     }
//   })
// }
