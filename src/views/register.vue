<template>
  <div class="register-main-wrapper">
    <div class="register-main-pane">
      <el-form :model="ruleForm" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item>
          <div style="margin-bottom: 20px; margin-left: 50px">
            <span style="font-family: 'PingFang SC'; font-size: 40px; font-weight: bold; letter-spacing: 10px"
              >注册</span
            >
          </div>
        </el-form-item>
        <el-form-item label="账号">
          <el-input placeholder="请输入账号" autofocus v-model="ruleForm.account"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="pass">
          <el-input show-password placeholder="请输入密码" autofocus v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPass">
          <el-input show-password placeholder="请重复密码" autofocus v-model="form.passwordConfirm"></el-input>
        </el-form-item> -->
        <el-form-item label="密码" prop="pass">
          <el-input placeholder="请输入密码" type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input placeholder="请重复密码" type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮件地址">
          <el-input placeholder="请输入邮件地址" v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button round style="width: 100%" @keydown.enter="onSubmit" type="primary" @click="onSubmit('ruleForm')"
            >提交</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button round style="width: 100%" @click="routeToLogin">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from 'js-sha1'

export default {
  name: 'login',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loadingInstance: null,
      ruleForm: {
        account: '',
        pass: '',
        checkPass: '',
        email: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},

  methods: {
    onSubmit(formName) {
      this.loadingInstance = this.$loading({
        fullscreen: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)',
        text: '注册中...'
      })
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$url.userRegister,
            method: 'post',
            data: {
              userAccount: this.ruleForm.account,
              userPassword: sha1(this.ruleForm.checkPass),
              userEmail: this.ruleForm.email
            }
          }).then(res => {
            if (res.status == 200 && res.data.registerStatus == true) {
              this.loadingInstance.close()
              this.$message({
                type: 'success',
                message: '注册成功!'
              })
              this.$router.push('/login')
            } else {
              this.loadingInstance.close()
              this.$message({
                type: 'error',
                message: '注册失败!'
              })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败、请检查校验项!'
          })
          return false
        }
      })
    },
    routeToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less">
.register-main-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.register-main-pane {
  // border: @blackSolidBorder;
  width: 300px;
}
</style>
