<template>
  <div class="mx-4">
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="8" class="text-right">
        请输入对方的用户名：
      </el-col>
      <el-col :span="8">
        <el-input size="small" v-model="friend.nickname"></el-input>
      </el-col>
      <el-col :span="8" class="ml-2">
        <el-button size="small" type="primary"
          @click="askACall" :disabled="status!='free'"
        >{{status == 'free' ? '呼叫' : '正在呼叫...'}}</el-button>
        <el-button size="small" type="danger" :disabled="status=='free'"
          @click="stopACall"
        >挂断</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10" :hidden="status === 'free'" class="mt-4">
      <el-col :span="12" :offset="3" :hidden="status==='linking'" class="transition-all">
        <video src="" class="m-2 friend-video border" ref="friend-video" autoplay
          poster="@/assets/webrtc.png"
        ></video>
        <p class="text-center">{{friend.nickname}}</p>
      </el-col>
      <el-col :span="status==='linking'? 12 : 6" :offset="status==='linking' ? 6 : 0" class="transition-all">
        <video src="" class="w-full m-2 border" id="self-video" ref="self-video" autoplay
          poster="@/assets/webrtc.png"
          muted
        ></video>
        <p class="text-center">我</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
import Presentor from '../presentor/presentor'
import Viewer from '../live/viewer'
import { getGlobalSocket } from '@/socket'

let presentor = null
let viewer = null
export default {
  name: 'page-call',
  data () {
    return {
      friend: {
        nickname: ''
      },
      status: 'free'
    }
  },
  created () {
    window.addEventListener('unload', this.stopACall)
  },
  mounted () {
    console.log(this)
  },
  beforeDestroy () {
    this.stopACall()
    window.removeEventListener('unload', this.stopACall)
  },
  methods: {
    askACall () {
      const { nickname } = this.friend
      if (!nickname || !nickname.trim()) {
        this.$message.warning('请输入对方用户名')
        return
      }
      this.stopACall()
      presentor = new Presentor(this.$refs['self-video'])
      presentor.on('error', this.onCallerror)
      presentor.start(nickname.trim(), false)
      this.status = 'linking'
      this.bindEvents()
    },
    stopACall () {
      this.offEvents()
      presentor && presentor.stop()
      viewer && viewer.stop()
      this.status = 'free'
    },
    bindEvents () {
      const socket = getGlobalSocket()
      socket.once('callaccepted', this.onCallaccepted)
      socket.once('callrejected', this.onCallrejected)
      socket.on('callerror', this.onCallerror)
    },
    offEvents () {
      const socket = getGlobalSocket()
      socket.off('callaccepted', this.onCallaccepted)
      socket.off('callrejected', this.onCallrejected)
      socket.off('callerror', this.onCallerror)
    },
    onCallrejected ({ to }) {
      this.stopACall()
      this.status = 'free'
      Notification.warning({
        title: `呼叫已被${to.nickname}拒绝`
      })
    },
    onCallaccepted ({ to, linkId }) {
      console.log(`呼叫已被${to.nickname}接听`)
      this.status = 'calling'
      Notification.success({
        title: `呼叫已被${to.nickname}接听`,
        message: '正在建立连接...'
      })
      viewer = new Viewer(this.$refs['friend-video'], linkId)
      viewer.on('presentorgone', _ => {
        this.stopACall()
      })
      viewer.start()
    },
    onCallerror ({ message }) {
      this.stopACall()
      Notification.error({
        title: message
      })
      this.status = 'free'
    }
  }
}
</script>

<style>
.transition-all {
  transition: all .4s;
}
</style>
