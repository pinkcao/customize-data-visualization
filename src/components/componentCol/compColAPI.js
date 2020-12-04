import url from '../../mock/mockAPI.js'
import axios from 'axios'

export function getTabPaneData() {
  axios({
    url: url.tabData,
    method: 'post',
    params: {}
  }).then(res => {
    return res
  })
}
