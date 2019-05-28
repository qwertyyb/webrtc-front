<template>
  <div class="page-video-list px-16">
    <div class="flex items-center justify-center">
      <div class="flex items-center">
        <div class="w-12 text-right mr-2">时间</div>
        <el-date-picker type="datetimerange"
          v-model="form.createdAtRange"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
          :clearable="false"
        ></el-date-picker>
      </div>
      <div class="mx-6">
        时长&nbsp;
        <el-input-number size="small" v-model="form.minDuration" :min="0" :max="10000"></el-input-number>秒
        到
        <el-input-number size="small" v-model="form.maxDuration" :min="0" :max="10000"></el-input-number>秒
      </div>
      <div class="flex items-center">
        <div class="w-12">地点</div>
        <el-input v-model="form.location" size="small"></el-input>
      </div>
      <div class="ml-2">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="video-list flex justify-center flex-wrap mt-4" v-loading="loading">
      <div class="video-item border w-1/5 p-1 m-2 shadow" v-for="item in list" :key="item.id">
        <video :src="item.uri" controls
          class="w-full outline-none"
          preload="none"
        ></video>
        <div class="info mt-2 leading-normal text-grey-darker text-sm tracking-wide">
          <div class="">创建时间: &nbsp;{{item.createdAt}}</div>
          <div class="">地点: &nbsp;{{item.location}}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <el-pagination background :current-page.sync="page"
        layout="prev, pager, next"
        @current-change="current => getList(current, pageSize)"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getVideoList } from '@/api'

let searchForm = {}
export default {
  name: 'page-video-list',
  data () {
    return {
      form: {
        createdAtRange: ['2018-01-01 08:00:00', '2020-01-01 08:00:00'],
        minDuration: 0,
        maxDuration: 100,
        location: ''
      },
      list: [],
      page: 1,
      pageSize: 20,
      total: 50,
      loading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    search () {
      const { createdAtRange, ...rest } = this.form
      const range = createdAtRange || ['', '']
      searchForm = {
        ...rest,
        startTime: range[0],
        endTime: range[1]
      }
      this.getList()
    },
    async getList (page = this.page, size = this.pageSize) {
      this.loading = true
      const { data } = await getVideoList({
        page, size, ...searchForm
      })
      this.list = data.videos
      this.page = data.page
      this.total = data.total
      this.pageSize = data.size
      this.loading = false
    }
  }
}
</script>

<style>

</style>
