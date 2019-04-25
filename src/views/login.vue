<template>
<div class="page-login">
  <h1 class="font-bold text-3xl text-center">{{title[mode]}}</h1>
  <el-row type="flex" justify="center">
    <el-col :span="8" class="mt-8">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model.trim="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model.trim="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" v-if="mode=='register'">
          <el-input v-model.trim="form.password2" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button type="text" v-if="mode=='login'" @click="mode='register'">没有账号，注册一个</el-button>
          <el-button type="text" v-if="mode=='register'" @click="mode='login'">已有账号，点击登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { register } from '@/api'

export default {
  name: 'page-login',
  data () {
    return {
      mode: 'login',
      title: {
        login: '登录',
        register: '注册'
      },
      form: {
        nickname: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.mode === 'login' && this.login()
      this.mode === 'register' && this.register()
    },
    login () {
      const { nickname, password } = this.form
      if (!nickname || !password) {
        return this.$message.warning('请输入用户名或密码')
      }
      this.$store.dispatch('login', { nickname, password }).then(_ => {
        const redirectUrl = decodeURIComponent(this.$route.query.redirectUrl || '%2F')
        this.$router.replace(redirectUrl)
      })
    },
    register () {
      const { nickname, password, password2 } = this.form
      if (!nickname) {
        return this.$message.error('请输入用户名')
      }
      if (!password) {
        return this.$message.error('请输入密码')
      }
      if (password !== password2) {
        return this.$message.error('两次密码不一致')
      }
      register({ nickname, password }).then(_ => {
        this.$message.success('注册成功, 请登录')
        this.form.nickname = this.form.password = this.form.password2 = ''
        this.mode = 'login'
      })
    }
  }
}
</script>

<style>

</style>
