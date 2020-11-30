import testComponentA from './testComponentA'
//所有用到的组件全部import或者require即可
const comMap = new Map()
comMap.set('compA', testComponentA)

export function getComponent(comName) {
  return comMap.get(comName)
}
