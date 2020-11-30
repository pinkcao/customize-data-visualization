import testComponentA from './testComponentA'

const comMap = new Map()
comMap.set('compA', testComponentA)

export function getComponent(comName) {
  return comMap.get(comName)
}
