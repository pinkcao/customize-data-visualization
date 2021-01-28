<template>
  <div class="login-main-pane">
    <div class="login-carousel">test</div>
    <div class="login-input-pane">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input autofocus v-model="form.account" @keydown.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input autofocus v-model="form.password" @keydown.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button autofocus @keydown.enter="onSubmit" type="primary" @click="onSubmit">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import url from '@mock/mockAPI.js'

export default {
  name: 'login',
  data() {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    // let sha1 = require('js-sha1')
    // console.log(sha1('test'))
    // this.testjson()
  },

  methods: {
    testjson() {
      // let dataSource = [
      //   ['department', '2018', '2019', '2020', '2021'],
      //   ['finance', 43.3, 85.8, 93.7, 55.4],
      //   ['humanResource', 83.1, 73.4, 55.1, 77.3],
      //   ['sales', 86.4, 65.2, 82.5, 41.5],
      //   ['product', 72.4, 53.9, 39.1, 14.8],
      //   ['qualityAssurance', 55.1, 66.5, 46.8, 34.8]
      // ]
      // console.log(JSON.stringify(dataSource))
      // this.$axios({
      //   url: 'http://localhost:8080/testjson',
      //   method: 'post',
      //   data: {
      //     textColumn: JSON.stringify(dataSource)
      //   }
      // }).then(res => {
      //   console.log(res)
      // })
      //上方是测试json数据传入,下方是测试json数据传出
      // this.$axios({
      //   url: 'http://localhost:8080/testfetchjson',
      //   method: 'post',
      //   data: {}
      // }).then(res => {
      //   console.log(JSON.stringify(dataSource))
      //   console.log(JSON.parse(res.data[0].textColumn))
      // })
    },
    onSubmit() {
      let sha1 = require('js-sha1')
      //account = admin
      //password = admin
      this.$axios({
        url: url.userLogin,
        method: 'post',
        data: {
          account: this.form.account,
          password: sha1(this.form.password)
        }
      }).then(res => {
        if (res.data.loginStatus == true) {
          console.log(res.data)
          this.$store.commit('changeCurrentUserID', res.data.userID)
          console.log('登录成功')
          this.$router.push('/templateSelect')
        }
      })
    }
  }
}
</script>

<style lang="less">
.login-main-pane {
  display: flex;
  // flex-direction: row;
  // justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.login-carousel {
  // flex: 2;
  width: 50%;
  background-color: black;
  margin-left: 5%;
}

.login-input-pane {
  width: 300px;
  margin: auto;
  // border: 1px solid black;
  // height: 500px;
  // flex: 1;
}
</style>
