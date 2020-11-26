//支持 dataset 的图表有： line、bar、pie、scatter、effectScatter、parallel、candlestick、map、funnel、custom
const barschema = {
  title: true,
  showAxis: true,
  dataSource: true,
  tooltip: true,
  dataZoom: false
  // series: true
}
const lineschema = {
  title: true,
  showAxis: true,
  dataSource: true,
  tooltip: true,
  dataZoom: false
}
const pieschema = {
  title: true,
  showAxis: false,
  dataSource: true,
  tooltip: true,
  dataZoom: false
}
const scatterschema = {
  title: true,
  showAxis: true,
  dataSource: true,
  tooltip: true,
  dataZoom: true
}
const customschema = {
  title: true,
  showAxis: false,
  dataSource: true,
  tooltip: false,
  dataZoom: false
}
const effectScatterschema = {
  title: true,
  showAxis: false,
  dataSource: true,
  tooltip: false,
  dataZoom: false
}
const parallelschema = {
  title: true,
  showAxis: true,
  dataSource: true,
  tooltip: false,
  dataZoom: false
}
const candlestickschema = {
  title: true,
  showAxis: false,
  dataSource: true,
  tooltip: false,
  dataZoom: false
}
const mapschema = {
  title: true,
  showAxis: false,
  dataSource: true,
  tooltip: false,
  dataZoom: false
}
const funnelschema = {
  title: true,
  showAxis: false,
  dataSource: true,
  tooltip: false,
  dataZoom: false
}
const supportedType = [
  {
    id: 0,
    type: '柱形图',
    value: 'bar'
  },
  {
    id: 1,
    type: '折线图',
    value: 'line'
  },
  {
    id: 2,
    type: '饼图',
    value: 'pie'
  },
  {
    id: 3,
    type: '散点图',
    value: 'scatter'
  }
]

export function loadSupportedType() {
  return supportedType
}

const dataMap = new Map()
dataMap.set('bar', barschema)
dataMap.set('line', lineschema)
dataMap.set('pie', pieschema)
dataMap.set('scatter', scatterschema)
dataMap.set('funnel', funnelschema)
dataMap.set('map', mapschema)
dataMap.set('parallel', parallelschema)
dataMap.set('candlestick', candlestickschema)

export function loadSchema(type) {
  return dataMap.get(type)
}
