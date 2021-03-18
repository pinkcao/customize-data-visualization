// import axios from 'axios'

// // 创建axios实例
// var instance = axios.create({ timeout: 1000 * 12 })
// instance.defaults.withCredentials = true

// instance.interceptors.request.use(config => {
//   // console.log('holyshit')
//   if (window.localStorage.getItem('Auth-Token')) {
//     config.headers['Authorization'] = window.localStorage.getItem('Auth-Token')
//   }
//   return config
// })

// //异步请求后，判断token是否过期
// instance.interceptors.response.use(
//   response => {
//     //拦截响应，做统一处理
//     console.log(response)
//     // if (response.status) {
//     //   switch (response.status) {
//     //     case 401:
//     //       console.log('拦截到401')
//     //       router.push('/login')
//     //   }
//     // }
//     // console.log(response.)
//     return response
//   },
//   error => {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           window.localStorage.removeItem('Auth-Token')
//           this.$router.push('/')
//       }
//     }
//   }
// )
// export default instance
