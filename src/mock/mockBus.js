// import mockBase from './mockData/mockBase.js'
// import mockScreen from './mockData/mockScreen.js'

// export default {
//   mockBase,
//   mockScreen
// }

import { importToMap } from '../common/core/loader.js'

export const mockSource = importToMap(require.context('./mockData', true, /\.js$/))

// console.log(mockBase)

// const files = require.context('./mockData', true, /\.js$/)

// console.log(files.keys())
// let lib = {}

// //key是相对路径名
// files.keys().forEach(key => {
//   const model = files(key)
//   lib = { ...lib, ...(model.default || model) }
// })

// console.log(lib)

// export default lib
