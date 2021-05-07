/**
 * 所有的接口
 */
const BASE_URL = 'http://localhost:8080/'

export default {
  getComponentTabData: `${BASE_URL}api/componentCol/getComponentTabData`, //finished
  getComponentList: `${BASE_URL}api/component/getComponent`, // it`s fucking finished
  appendComponentList: `${BASE_URL}api/component/appendComponent`, // it`s fucking finished
  adjustComponent: `${BASE_URL}api/component/adjustComponent`, //finished
  spliceComponentList: `${BASE_URL}api/component/spliceComponent`, //finished
  updateZindexComponentList: `${BASE_URL}api/component/updateComponentZindex`, //finished
  updateComponentBasicStatus: `${BASE_URL}api/component/updateComponentBasicStatus`, //finished
  userLogin: `${BASE_URL}api/user/login`, //finished
  userRegister: `${BASE_URL}api/user/register`, //finished
  validateAccount: `${BASE_URL}api/user/validateAccount`, //finished
  refreshLoginStatus: `http//localhost:8080/api/user/refreshLoginStatus`, //finished
  getScreenDef: `${BASE_URL}api/screen/getScreenDef`, //maybe finished
  updateScreenDef: `${BASE_URL}api/screen/updateScreenDef`, //maybe finished
  getScreenStretch: `${BASE_URL}api/screen/getScreenStretch`, //maybe finished
  updateScreenStretch: `${BASE_URL}api/screen/updateScreenStretch`, //maybe finished
  getBackgroundStyle: `${BASE_URL}api/screen/getBackgroundStyle`, //maybe finished
  updateBackgroundStyle: `${BASE_URL}api/screen/updateBackgroundStyle`, //maybe finished
  getTemplateList: `${BASE_URL}api/template/getTemplateList`, //finished
  appendTemplate: `${BASE_URL}api/template/appendTemplate`, //finished
  spliceTemplate: `${BASE_URL}api/template/spliceTemplate`, //finished
  updateTemplate: `${BASE_URL}api/template/updateTemplate`, // no such API
  basePicurl: `${BASE_URL}componentImage/`, //picurl
  testJsonData: `${BASE_URL}testJsonData`, // mock random data for API fetch
  componentTrans: `${BASE_URL}api/component/componentTrans` // data initialization API finished
}
