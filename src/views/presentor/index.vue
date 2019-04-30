<template>
  <div class="page-live flex justify-center">
    <div class="container-video flex justify-center flex-col items-center bg-black p-2 relative">
      <video :src="src" class="video w-full" ref="video" autoplay
        poster="@/assets/webrtc.png"
      ></video>
      <div class="living-controls-wrapper mt-2 flex w-full items-center">
        <span class="text-white mr-auto">状态: {{statusText}}</span>
        <el-button type="primary" @click="start" v-if="status=='initial'">开始直播</el-button>
        <el-button type="danger" class="ml-3" @click="stop" v-else-if="status!='starting'">停止直播</el-button>
      </div>
    </div>
    <div class="container-message w-64 rounded ml-4 flex flex-col justify-between bg-gray-200">
      <div class="wrapper-messages bg-gray-100 border p-2 overflow-y-auto">
        <template v-for="message in messages">
          <div class="message-ite flex justify-center py-1 items-center mb-2 text-sm bg-gray-500 text-center rounded-full"
            :key="message.id" v-if="message.type == 'viewer-entry'">
            <span>{{message.time}}</span>
            <img :src="message.from.avatar" alt="" class="w-6 mx-1 rounded-full">
            <span class="font-bold mr-1 text-blue-600">{{message.from.nickname}}</span>
            <span>已 <b>进入</b> 直播间</span>
          </div>
          <div class="message-ite flex justify-center py-1 items-center mb-2 text-sm bg-red-600 text-center rounded-full"
            :key="message.id" v-if="message.type == 'viewer-leave'">
            <span>{{message.time}}</span>
            <img :src="message.from.avatar" alt="" class="w-6 mx-1 rounded-full">
            <span class="font-bold mr-1 text-blue-900">{{message.from.nickname}}</span>
            <span>已 <b>离开</b> 直播间</span>
          </div>
        </template>
      </div>
      <div class="wrapper-input mx-auto p-2" v-if="false">
        <input type="text" class="border h-8 rounded">
        <button class="bg-blue-600 h-full px-2 text-white hover:bg-blue-light rounded ml-2">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import Presentor from './presentor'

let presentor = null

export default {
  name: 'page-presentor',
  data () {
    return {
      src: null, // 'http://vt1.doubanio.com/201903181816/4191665522bbfd3a842c307fd67f0b25/view/movie/M/402410829.mp4',
      status: 'initial',
      messages: [
        // {
        //   type: 'viewer-entry',
        //   from: { nickname: '虚幻', avatar: 'https://via.placeholder.com/150' },
        //   time: '12:12:12'
        // },
        // {
        //   type: 'viewer-leave',
        //   from: { nickname: '虚幻', avatar: 'https://via.placeholder.com/150' },
        //   time: '12:12:12'
        // }
      ]
    }
  },
  computed: {
    statusText () {
      const text = {
        initial: '未开始',
        starting: '准备中',
        living: '直播中',
        ending: '结束中',
        ended: '已结束'
      }
      return text[this.status]
    }
  },
  created () {
    window.addEventListener('unload', () => {
      this.stop()
    })
  },
  beforeDestroy () {
    console.log('before destroy')
    this.stop()
  },
  methods: {
    start () {
      this.status = 'starting'
      presentor = new Presentor(this.$refs.video)
      console.log(presentor)
      presentor.on('start', () => {
        this.status = 'living'
      })
      presentor.on('error', error => {
        console.log(error)
        this.stop()
      })
      presentor.on('message', message => {
        console.log('received message:', message)
        this.messages.push(message)
      })
      presentor.start()
    },
    stop () {
      presentor && presentor.stop()
      presentor = null
      this.status = 'initial'
    }
  }
}
</script>

<style lang="less" scoped>
.page-live {
  height: 540px;
  max-height: 540px;
  .wrapper-messages {
    height: 500px;
  }
  .container-video {
    // height: 540px;
    // width: 660px;
    // video.video::-webkit-media-controls {
    //   position: absolute;
    //   bottom: 0;
    //   left: 0;
    //   right: 0;
    //   z-index: 5;
    //   width: 100%;
    //   height: 100px;
    // }
  }
}
</style>
