import Mock from 'mockjs'
import url from '@mock/mockAPI.js'
Mock.setup({
  timeout: '200-600'
})

const testJsonData = [
  ['department', '2018'],
  ['finance', 43.3],
  ['humanResource', 83.1],
  ['sales', 86.4],
  ['product', 72.4],
  ['qualityAssurance', 55.1]
]

export default {
  testJsonData: Mock.mock(url.testJsonData, 'post', () => {
    return testJsonData
  })
}
