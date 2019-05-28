<template>
  <div class="page-live flex justify-center">
    <div class="container-video flex justify-center flex-col p-2 items-center bg-black relative">
      <video :src="src" class="video w-full m-2" ref="video" autoplay
        poster="@/assets/webrtc.png"
      ></video>
      <div class="living-controls-wrapper m-1 pl-2 flex w-full items-center">
        <span class="text-white mr-auto">状态: {{statusText}}</span>
      </div>
    </div>
    <div class="container-message w-64 ml-4 flex flex-col justify-between" v-if="false">
      <div class="wrapper-message">
        这是消息内容
      </div>
      <div class="wrapper-input">
        <input type="text" class="border h-8 rounded">
        <button class="bg-blue h-full px-2 text-white hover:bg-blue-light rounded ml-2">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import Viewer from './viewer'

let viewer = null

export default {
  name: 'page-live',
  data () {
    return {
      src: null, // 'http://vt1.doubanio.com/201903181816/4191665522bbfd3a842c307fd67f0b25/view/movie/M/402410829.mp4',
      status: 'initial'
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
  mounted () {
    this.start()
  },
  beforeDestroy () {
    console.log('before destroy')
    this.stop()
  },
  methods: {
    start () {
      this.status = 'starting'
      viewer = new Viewer(this.$refs.video, this.$route.params.liveId)
      console.log(viewer)
      viewer.on('start', () => {
        this.status = 'living'
      })
      viewer.on('presentorgone', this.stop)
      viewer.start()
    },
    stop () {
      viewer && viewer.stop()
      viewer = null
      this.status = 'initial'
    }
  }
}
</script>

<style lang="less" scoped>
.page-live {
  .container-video {
    // height: 520px;
    width: 660px;
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
