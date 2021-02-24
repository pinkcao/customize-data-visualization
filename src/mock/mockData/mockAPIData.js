import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

const departmentName = ['finance', 'HR', 'sales', 'QA', 'develop', 'product', 'market', 'departmentA', 'departmentB']
const year = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']

// let testJsonData = [
//   ['department', '2018'],
//   ['finance', 43.3],
//   ['humanResource', 83.1],
//   ['sales', 86.4],
//   ['product', 72.4],
//   ['qualityAssurance', 55.1]
// ]

// let testJsonData = generateData(Math.floor(Math.random() * 4 + 1), Math.floor(Math.random() * 7 + 1))

function generateData(scaleX, scaleY) {
  //result to return
  let jsonData = []
  //generate firstRow
  let firstRow = []
  firstRow.push('department')
  for (let i = 0; i < scaleX; i++) {
    firstRow.push(year[i])
  }
  //finished

  jsonData.push(firstRow)
  for (let i = 0; i < scaleY; i++) {
    let row = []
    row.push(departmentName[i])
    for (let j = 0; j < scaleX; j++) {
      row.push(Math.floor(Math.random() * 500 + 100))
    }
    jsonData.push(row)
  }

  return jsonData
  // let jsonData = []
  // let firstRow = []
  // for (let i = 0; i < scaleX; i++) {
  //   let rowData = []

  // }
}

export default {
  testJsonData: Mock.mock(url.testJsonData, 'post', () => {
    return generateData(Math.floor(Math.random() * 4 + 1), Math.floor(Math.random() * 7 + 1))
  })
}
