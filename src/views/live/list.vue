<template>
<div>
  <div class="livings-page m-2 flex flex-wrap">
    <router-link tag="section"
      v-for="item in list"
      :key="item.id"
      :to="`/live/${item.id}`"
      class="living-item m-2 rounded border p-2 bg-white cursor-pointer hover:shadow-lg relative"
      style="transition: all .3s"
    >
      <img :src="item.user.avatar" alt="" class="w-64 h-48">
      <h3 class="mt-2 truncate text-center">主播: {{item.user.nickname}}</h3>
      <i class="el-icon-caret-right text-6xl absolute top-0 left-0 mt-20 ml-24 hover:shadow rounded"></i>
    </router-link>
  </div>
  <h3 class="text-center my-16 color-gray-200" v-if="list.length <= 0">
    暂时没有主播在直播，
    <router-link to="/presentor" class="underline text-blue-400">立刻抢沙发做直播！！</router-link>
  </h3>
</div>
</template>

<script>
import { getLivingList } from '@/api'

export default {
  name: 'page-livings',
  data () {
    return {
      list: [
        // {
        //   id: 1,
        //   user: {
        //     nickname: '虚幻',
        //     avatar: 'https://via.placeholder.com/50'
        //   }
        // }
      ]
    }
  },
  created () {
    this.getLivingList()
  },
  methods: {
    async getLivingList (page = 1, size = 10) {
      const { data } = await getLivingList({ page, size })
      this.list = data.presentors
    }
  }
}
</script>

<style>

</style>
