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
      <img src="http://via.placeholder.com/150" alt="" class="user-avatar h-12 w-12 rounded-full">
    </header>
    <router-view/>
  </div>
</template>

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
</style>
