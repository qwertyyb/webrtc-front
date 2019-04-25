import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import store from '@/store'
import router from '../router'

const http = axios.create({
  baseURL: '/api/v1'
})
http.interceptors.request.use(config => {
  NProgress.start()
  config.headers = {
    ...config.headers,
    token: store.state.token
  }
  return config
})

http.interceptors.response.use(response => {
  NProgress.done()
  if (response.data.status === 1) {
    return response.data
  }
  if (response.data.status === 403) {
    return router.push('/login')
  }
  Message.error(response.data.msg || '服务出错')
  throw new Error(response.data.msg || '服务出错')
})

export default http
