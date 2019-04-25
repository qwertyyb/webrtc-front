import io from 'socket.io-client'
import { MessageBox, Message } from 'element-ui'
import store from './store'
import router from './router'

let socket = null

const errorHandler = err => {
  Message.error(err.message)
}

// 全局的socket， 一直存在，用来接收电话(call)请求,发送拒绝和接收
const startGlobalSocket = () => {
  socket = io({
    path: '/socket.io/webrtc',
    reconnection: false,
    query: {
      token: store.state.token
    }
  })
  socket.on('connect_error', errorHandler)
  socket.on('error', errorHandler)
  socket.on('call', ({ from, linkId }) => {
    MessageBox.confirm(`你有一通来自${from.nickname}的呼叫,是否接听？`, '提醒', {
      cancelButtonText: '拒绝',
      confirmButtonText: '接听'
    }).then(_ => {
      // socket.emit('acceptcall', { from })
      // TODO 开始接听
      router.push({ name: 'acceptcall', query: { inviter: encodeURIComponent(JSON.stringify(from)), linkId: encodeURIComponent(linkId) } })
    }).catch(error => {
      socket.emit('rejectcall', { from })
      throw error
    })
  })
  socket.on('autherror', _ => {
    console.log('auth error, need relogin')
    store.commit('clearAuthState')
    router.push(`/login?redirectUrl=${encodeURIComponent(router.currentRoute.fullPath)}`)
  })
  socket.emit('online')
  return socket
}

const stopGlobalSocket = () => {
  if (socket) {
    socket.emit('offline')
    socket.close()
    socket = null
  }
}

const getGlobalSocket = _ => {
  if (socket) return socket
  if (socket.state.token) return startGlobalSocket()
  throw new Error('no token, cant start a socket')
}

const getNewSocket = _ => {
  const socket = io({
    path: '/socket.io/webrtc',
    reconnection: false,
    query: {
      token: store.state.token
    }
  })
  socket.on('connect_error', errorHandler)
  socket.on('error', errorHandler)
  return socket
}

export { startGlobalSocket, stopGlobalSocket, getGlobalSocket, getNewSocket }
