import { iceServers } from '@/config/webrtc'
import kurentoUtils from 'kurento-utils'
import io from 'socket.io-client'
import store from '../../store'

class Viewer {
  socket = null
  videoDom = null
  webRtcPeer = null
  events = {
    start: [],
    stop: [],
    presentorgone: []
  }
  constructor (videoDom, presentorId) {
    console.log(videoDom)
    this.socket = io({
      path: '/socket.io/webrtc',
      query: {
        token: store.state.token,
        presentorId
      },
      reconnection: false
    })
    this.socket.on('error', error => {
      this.emit('error', error)
    })
    this.socket.on('connect_error', error => {
      console.log('error')
      this.emit('error', error)
    })
    this.videoDom = videoDom
    videoDom.addEventListener('canplay', this._onVideoCanplay)
  }
  _onVideoCanplay = _ => {
    this.emit('start')
  }
  bindEvent = () => {
    const { socket, webRtcPeer } = this
    socket.on('startResponse', ({ sdpAnswer }) => {
      console.log('SDP answer received from server. Processing ...')
      webRtcPeer.processAnswer(sdpAnswer)
    })
    socket.on('iceCandidate', ({ candidate }) => {
      console.log('iceCandidate', candidate)
      webRtcPeer.addIceCandidate(candidate)
    })
    socket.on('presentorgone', _ => {
      this.videoDom.pause()
      this.videoDom.srcObject = null
      this.videoDom.load()
      this.emit('presentorgone')
      this.socket.close()
      this.emit('stop')
    })
    console.log(webRtcPeer)
  }
  start = () => {
    const options = {
      remoteVideo: this.videoDom,
      onicecandidate: this.onIceCandidate,
      configuration: {
        iceServers
      }
    }
    return new Promise((resolve, reject) => {
      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, error => {
        if (error) return reject(error)
        resolve()
      })
    }).then(_ => {
      this.bindEvent()
      return new Promise((resolve, reject) => this.webRtcPeer.generateOffer((error, sdp) => {
        if (error) return reject(error)
        resolve(sdp)
      }))
    }).then(sdp => {
      console.info('Invoking SDP offer callback function ' + location.host)
      this.socket.emit('createViewer', {
        sdpOffer: sdp
      })
    })
  }

  stop = () => {
    console.log('Stopping viewer ...')
    if (this.webRtcPeer) {
      this.webRtcPeer.dispose()
      console.log('dispose')
      this.webRtcPeer = null
    }
    this.socket.emit('stopViewer')
  }

  onIceCandidate = candidate => {
    console.log('Local candidate' + JSON.stringify(candidate))

    this.socket.emit('onIceCandidate', { candidate })
  }

  emit (name, ...args) {
    if (!Object.keys(this.events).includes(name)) return
    const cbs = this.events[name]
    return cbs.map(func => func(...args))
  }
  on (name, cb) {
    if (!Object.keys(this.events).includes(name)) return
    const cbs = this.events[name]
    if (cbs.includes(cb)) return
    cbs.push(cb)
  }
}

export default Viewer
