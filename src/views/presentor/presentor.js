import { iceServers } from '@/config/webrtc'
import kurentoUtils from 'kurento-utils'
import io from 'socket.io-client'

class Presentor {
  socket = null
  localVideo = null
  webRtcPeer = null
  events = {
    start: [],
    stop: []
  }
  constructor (localVideo) {
    this.socket = io({
      path: '/webrtc',
      reconnectionAttempts: 5,
      forceNew: true
    })
    this.localVideo = localVideo
  }
  bindEvent = () => {
    const { socket, webRtcPeer } = this
    socket.on('startResponse', ({ sdpAnswer }) => {
      console.log('SDP answer received from server. Processing ...')
      webRtcPeer.processAnswer(sdpAnswer)
      this.emit('start')
    })
    socket.on('error', ({ message }) => {
      throw new Error('Error message from server: ' + message)
    })
    socket.on('iceCandidate', ({ candidate }) => {
      webRtcPeer.addIceCandidate(candidate)
    })
  }
  start = () => {
    const options = {
      // localVideo: this.localVideo,
      remoteVideo: this.localVideo,
      mediaConstraints: {
        video: {
          width: 640,
          height: 480
        },
        audio: true
      },
      onicecandidate: this.onIceCandidate,
      configuration: {
        iceServers
      }
    }
    return new Promise((resolve, reject) => {
      this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, error => {
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
      this.socket.emit('start', {
        sdpOffer: sdp
      })
    })
  }

  stop = () => {
    console.log('Stopping video call ...')
    if (this.webRtcPeer) {
      this.webRtcPeer.dispose()
      this.webRtcPeer = null
    }
    this.socket.emit('stop')
    this.socket.close()
    this.emit('stop')
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

export default Presentor
