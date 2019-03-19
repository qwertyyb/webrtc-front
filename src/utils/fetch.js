import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'

const http = axios.create({
  baseURL: ''
})
http.interceptors.request.use(config => {
  NProgress.start()
  return config
})

http.interceptors.response.use(response => {
  NProgress.done()
  if (response.data.status === 1) {
    return response.data
  }
  Message.error(response.data.msg || '服务出错')
  throw new Error(response.data.msg || '服务出错')
})

export default http
