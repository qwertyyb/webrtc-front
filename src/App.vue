<template>
  <div id="app" class="bg-grey-lighter mx-16">
    <el-menu default-active="/livings" style="margin: 20px 0" mode="horizontal" router>
      <el-menu-item index="/">
        <h1>
          <img src="@/assets/webrtc-logo.svg" alt="" class="w-64">
        </h1>
      </el-menu-item>
      <el-menu-item index="/presentor">我要做直播</el-menu-item>
      <el-menu-item index="/livings">我要看直播</el-menu-item>
      <el-menu-item index="/videos">往期直播记录</el-menu-item>
      <el-menu-item index="/call">视频通话</el-menu-item>
      <el-submenu index="2" style="float:right" v-if="userInfo.nickname">
        <template slot="title" class="user flex items-center">
          <img :src="userInfo.avatar || 'https://via.placeholder.com/50'" alt="" class="user-avatar inline-block h-12 w-12 rounded-full border">
          <span class="mx-2">{{userInfo.nickname}}</span>
        </template>
        <el-menu-item index="2-1">
          <el-button type="text" @click.stop="logout">注销登录</el-button>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <header class="flex p-1 items-center justify-between">
    </header>
    <router-view/>
  </div>
</template>

<script>
import { startGlobalSocket, stopGlobalSocket } from './socket'

export default {
  computed: {
    userInfo () {
      return this.$store.state.userInfo || {}
    },
    token () {
      return this.$store.state.token || ''
    }
  },
  watch: {
    token: {
      immediate: true,
      handler (val) {
        if (val) {
          startGlobalSocket()
          return
        }
        stopGlobalSocket()
      }
    }
  },
  beforeDestroy () {
    stopGlobalSocket()
  },
  methods: {
    logout () {
      this.$store.commit('clearAuthState')
      location.reload()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#app button {
  outline: none;
}
</style>
