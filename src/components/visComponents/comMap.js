import graphComponent from './graphComponent/graphComponent.vue'
import mapComponent from './mapComponent/mapComponent.vue'
import titleComponent from '../basicComponents/textComponent/titleText.vue'
//所有用到的组件全部import或者require即可
const comMap = new Map()
comMap.set('graphComponent', graphComponent)
comMap.set('mapComponent', mapComponent)
comMap.set('titleComponent', titleComponent)

export function getComponent(comName) {
  return comMap.get(comName)
}
