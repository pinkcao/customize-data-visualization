import graphComponent from './graphComponent/graphComponent.vue'
import mapComponent from './mapComponent/mapComponent.vue'
import titleComponent from '../basicComponents/textComponent/titleText.vue'
import funnelComponent from './graphComponent/funnelComponent.vue'
import polarBarComponent from './graphComponent/polarBarComponent.vue'
import KComponent from './graphComponent/KComponent.vue'
//所有用到的组件全部import即可
const comMap = new Map()
comMap.set('graphComponent', graphComponent)
comMap.set('mapComponent', mapComponent)
comMap.set('titleComponent', titleComponent)
comMap.set('funnelComponent', funnelComponent)
comMap.set('polarBarComponent', polarBarComponent)
comMap.set('KComponent', KComponent)

export function getComponent(comName) {
  return comMap.get(comName)
}
