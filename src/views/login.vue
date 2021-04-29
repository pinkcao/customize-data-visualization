<template>
  <div class="login-main-pane">
    <div class="login-carousel">test</div>
    <div class="login-input-pane">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input
            placeholder="请输入账号"
            autofocus
            v-model="form.account"
            @keydown.enter.native="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            show-password
            placeholder="请输入密码"
            autofocus
            v-model="form.password"
            @keydown.enter.native="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button round style="width: 100%" autofocus @keydown.enter="onSubmit" type="primary" @click="onSubmit"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button round style="width: 100%" @click="routeToRegister">注册</el-button>
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
      loadingInstance: null,
      form: {
        account: '',
        password: ''
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {
    this.loadingInstance.close()
  },
  destroyed() {},

  methods: {
    /**
     * 登录
     * @param:
     * @returns:
     */
    onSubmit() {
      this.loadingInstance = this.$loading({
        fullscreen: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)',
        text: '登录中'
      })
      let sha1 = require('js-sha1')
      //account = admin
      //password = admin
      this.$axios({
        url: url.userLogin,
        method: 'post',
        data: {
          userAccount: this.form.account,
          userPassword: sha1(this.form.password)
        }
      }).then(res => {
        if (res) {
          if (res.data.loginStatus == true) {
            window.localStorage.setItem('Auth-Token', res.data.token)
            console.log(res.data)
            window.localStorage.setItem('userID', res.data.userID)
            this.loadingInstance.close()
            this.$router.push('/templateSelect')
          } else {
            this.loadingInstance.close()
            this.$message.error('登录失败，请检查用户名与密码')
          }
        }
      })
    },
    routeToRegister() {
      this.$router.push({ path: '/register' })
    }
  }
}
</script>

<style lang="less">
.login-main-pane {
  display: flex;
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
}
</style>
