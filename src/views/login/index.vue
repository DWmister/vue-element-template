<template>
  <div class="login-container">
    <div><canvas id="canvas">你的浏览器不支持canvas</canvas></div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">vue3-ts-admin</h3>
      </div>
      <el-form-item prop="email">
        <span class="svg-container svg-container_login">
          <svg-icon name="user" />
        </span>
        <el-input v-model="loginForm.email" name="email" type="text" auto-complete="on" placeholder="email" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :name="pwdType === 'password' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>
      <div class="submit-btn">
        <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { isvalidateEmail } from '@/utils/validate'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import canvas from './canvas'
import { UserModule } from '@/store/modules/user'
import { Route } from 'vue-router'
import { ElForm } from 'element-ui/types/form'

const validateEmail = (rule: any, value: string, callback: any) => {
  if (!isvalidateEmail(value)) {
    callback(new Error('邮箱格式有误!'))
  } else {
    callback()
  }
}
const validatePass = (rule: any, value: string, callback: any) => {
  if (value.length < 5) {
    callback(new Error('请输入正确密码！'))
  } else {
    callback()
  }
}

@Component
// export default class Login extends Vue {
export default class Login extends mixins(canvas) {
  private loginForm = {
    email: 'admin@163.com',
    password: '1234567'
  }
  private loginRules = {
    email: [{ required: true, trigger: 'blur', validator: validateEmail }],
    password: [{ required: true, trigger: 'blur', validator: validatePass }]
  }
  private loading = false
  private pwdType = 'password'
  private redirect: string | undefined = undefined

  @Watch('$route', { immediate: true })
  private OnRouteChange (route: Route) {
    // TODO: remove the "as string" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    this.redirect = route.query && route.query.redirect as string
  }

  private showPwd () {
    this.pwdType = this.pwdType === 'password' ? '' : 'password'
  }

  private handleLogin () {
    (this.$refs.loginForm as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        UserModule.Login(this.loginForm)
          .then((res) => {
            if (res.code === '0x00') {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000
              })
              this.$router.push({ path: this.redirect || '/' })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
          .catch((err) => {
            console.warn(err)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss">
@import "src/styles/variables.sass";
@import "src/styles/login.sass"

</style>
