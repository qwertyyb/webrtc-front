<template>
  <div class="livings-page m-2 flex flex-wrap">
    <router-link tag="section"
      v-for="item in list"
      :key="item.id"
      :to="`/live/${item.id}`"
      class="living-item m-2 rounded border p-2 bg-white cursor-pointer hover:shadow-lg"
      style="transition: all .3s"
    >
      <img src="@/assets/webrtc.png" alt="" class="w-64 h-48">
      <h3 class="mt-2 truncate">{{item.name}}</h3>
    </router-link>
  </div>
</template>

<script>
import { getLivingList } from '@/api'

export default {
  name: 'page-livings',
  data () {
    return {
      list: [
        {
          id: '123456666',
          name: '虚幻虚幻'
        },
        {
          id: '12346666',
          name: '虚幻虚幻'
        }
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
