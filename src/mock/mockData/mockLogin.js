import Mock from 'mockjs'
import url from '@mock/mockAPI.js'

const userList = [
  {
    userAccount: 'admin',
    userPassword: 'd033e22ae348aeb5660fc2140aec35850c4da997',
    userID: 1
  },
  {
    userAccount: 'test',
    userPassword: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
    userID: 2
  }
]

export default {
  userLogin: Mock.mock(url.userLogin, 'post', params => {
    let args = JSON.parse(params.body)
    for (let i = 0; i < userList.length; i++) {
      if (args.account == userList[i].userAccount && args.password == userList[i].userPassword) {
        return {
          loginStatus: true,
          userID: userList[i].userID
        }
      }
    }
    return {
      loginStatus: false
    }
    // if (args.account == userAccount && args.password == userPassword) {
    //   return {
    //     loginStatus: true,
    //     userID: 1
    //   }
    // } else {
    //   return {
    //     loginStatus: false
    //   }
    // }
  })
}
