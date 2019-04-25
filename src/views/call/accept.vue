<template>
  <div class="page-accept mx-8">
    <el-row type="flex">
      <el-col :span="20" class="flex items-center">
        <h1 class="font-bold text-2xl">正在通话</h1>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" @click="stopCall">挂断</el-button>
      </el-col>
    </el-row>
    <el-row class="mx-4" :gutter="20">
      <el-col :span="12" v-loading="selfLoading" element-loading-text="正在连接..." element-loading-spinner="el-icon-loading">
        <video src="" autoplay class="w-full" ref="self-video" poster="@/assets/webrtc.png"></video>
        <p class="text-center">我</p>
      </el-col>
      <el-col :span="12" v-loading="friendLoading" element-loading-text="正在连接..." element-loading-spinner="el-icon-loading">
        <video src="" autoplay class="w-full" ref="friend-video"
          poster="@/assets/webrtc.png"
        ></video>
        <p class="text-center">{{inviter.nickname}}</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Presentor from '../presentor/presentor'
import Viewer from '../live/viewer'

let presentor = null
let viewer = null
export default {
  name: 'page-accept',
  data () {
    return {
      inviter: {},
      selfLoading: false,
      friendLoading: false
    }
  },
  watch: {
    '$route.query': {
      immediate: false,
      handler () {
        const originEncoded = decodeURIComponent(this.$route.query.inviter || '')
        const inviter = originEncoded && JSON.parse(originEncoded)
        const linkId = decodeURIComponent(this.$route.query.linkId || '')
        inviter && linkId && this.acceptCall(inviter, linkId)
      }
    }
  },
  created () {
    window.addEventListener('unload', this.stopCall)
    this.stopCall()
  },
  mounted () {
    const originEncoded = decodeURIComponent(this.$route.query.inviter || '')
    const inviter = originEncoded && JSON.parse(originEncoded)
    const linkId = decodeURIComponent(this.$route.query.linkId || '')
    inviter && linkId && this.acceptCall(inviter, linkId)
  },
  beforeDestroy () {
    this.stopCall()
    window.removeEventListener('unload', this.stopCall)
  },
  methods: {
    acceptCall (inviter, linkId) {
      this.inviter = inviter
      this.selfLoading = true
      this.friendLoading = true
      presentor = new Presentor(this.$refs['self-video'])
      presentor.on('start', () => {
        this.selfLoading = false
        presentor.socket.emit('acceptcall', { from: inviter })
        viewer = new Viewer(this.$refs['friend-video'], linkId)
        viewer.on('start', _ => {
          this.friendLoading = false
        })
        viewer.on('presentorgone', _ => {
          // 对方挂断
          this.stopCall()
        })
        viewer.start()
      })
      presentor.start()
    },
    stopCall () {
      presentor && presentor.stop()
      viewer && viewer.stop()
    }
  }
}
</script>

<style>

</style>
