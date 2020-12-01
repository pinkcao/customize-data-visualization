import url from '../../mock/mockAPI.js'

export function getTabPaneData() {
  this.$axios({
    url: url.tabData,
    method: 'post',
    params: {}
  }).then(res => {
    return res
  })
}
