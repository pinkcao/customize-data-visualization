import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

const userAccount = 'admin'
const userPassword = 'd033e22ae348aeb5660fc2140aec35850c4da997'

export default {
  userLogin: Mock.mock(url.userLogin, 'post', params => {
    let args = JSON.parse(params.body)
    if (args.account == userAccount && args.password == userPassword) {
      return {
        loginStatus: true,
        userID: 1
      }
    } else {
      return {
        loginStatus: false
      }
    }
  })
}
