<template>
  <div class="login-main-pane">
    <div class="login-carousel">test</div>
    <div class="login-input-pane">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
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
  mounted() {},

  methods: {
    onSubmit() {
      let sha1 = require('js-sha1')
      // console.log('点击登录')
      this.$axios({
        url: url.userLogin,
        method: 'post',
        data: {
          account: this.form.account,
          password: sha1(this.form.password)
        }
      }).then(res => {
        if (res.data == true) {
          console.log('登录成功')
          this.$router.push('/basePage')
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
