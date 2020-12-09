import graphComponent from './graphComponent.vue'
import mapComponent from './mapComponent.vue'
//所有用到的组件全部import或者require即可
const comMap = new Map()
comMap.set('compA', graphComponent)
comMap.set('compB', mapComponent)

export function getComponent(comName) {
  return comMap.get(comName)
}
