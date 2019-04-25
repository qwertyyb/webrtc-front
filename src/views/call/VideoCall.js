import io from 'socket.io-client'
import { MessageBox, Notification } from 'element-ui'

export default class VideoCall {
  socket = io({
    path: '/socket.io/webrtc',
    reconnection: false,
    reconnectionAttempts: 1
  })
  bindEvent () {
    this.socket.on('call', ({ from }) => {
      MessageBox.confirm(`来自${from.nickname}的呼叫，是否接听?`, '提醒').then(_ => {
        this.socket.emit('acceptcall', { from })
      })
    })
    this.socket.on('callaccepted', ({ to }) => {
      console.log(`呼叫已被${to.nickname}接听`)
      Notification.success({
        title: `呼叫已被${to.nickname}接听`,
        message: '正在建立连接...'
      })
    })
    this.socket.on('callrejected', ({ to }) => {
      Notification.warning({
        title: `呼叫已被${to.nickname}拒绝`
      })
    })
    this.socket.on('callback', ({ message }) => {
      Notification.info({
        title: message
      })
    })
  }
  askACall (nickname) {
    this.socket.emit('askacall', { to: { nickname } })
  }
}
