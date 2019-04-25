<template>
  <div id="app" class="bg-grey-lighter">
    <header class="flex p-1 items-center justify-between">
      <h1>WebRTC</h1>
      <div id="nav" class="mr-auto">
        <router-link to="/presentor">做直播</router-link> |
        <router-link to="/livings">看直播</router-link> |
        <router-link to="/videos">视频</router-link> |
        <router-link to="/call">对话</router-link>
      </div>
      <div class="user flex items-center" v-if="userInfo.nickname">
        <img :src="userInfo.avatar || 'https://via.placeholder.com/50'" alt="" class="user-avatar h-12 w-12 rounded-full border">
        <span class="mx-2">{{userInfo.nickname}}</span>
        <el-button type="text" @click="logout">退出</el-button>
      </div>
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
