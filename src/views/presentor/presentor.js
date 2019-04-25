import { iceServers } from '@/config/webrtc'
import kurentoUtils from 'kurento-utils'
import { getNewSocket } from '@/socket'

class Presentor {
  socket = null
  localVideo = null
  webRtcPeer = null
  events = {
    start: [],
    stop: [],
    error: [],
    callaccepted: [],
    callrejected: [],
    callerror: []
  }
  constructor (localVideo) {
    this.socket = getNewSocket()
    console.log(this.socket)
    this.socket.on('error', error => {
      this.emit('error', error)
    })
    this.socket.on('connect_error', error => {
      this.emit('error', error)
    })
    this.socket.on('callaccepted', message => {
      this.emit('callaccepted', message)
    })
    this.socket.on('callrejected', message => {
      this.emit('callrejected', message)
    })
    this.socket.on('callerror', error => {
      this.emit('callerror', error)
    })
    this.localVideo = localVideo
    localVideo.addEventListener('canplay', this._onVideoCanplay)
  }
  _onVideoCanplay = _ => {
    console.log('onvideocanplay')
    this.emit('start')
  }
  bindEvent = () => {
    const { socket, webRtcPeer } = this
    socket.on('startResponse', ({ sdpAnswer }) => {
      console.log('SDP answer received from server. Processing ...')
      webRtcPeer.processAnswer(sdpAnswer)
    })
    socket.on('iceCandidate', ({ candidate }) => {
      webRtcPeer.addIceCandidate(candidate)
    })
  }
  start = (nickname = null) => {
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
      this.socket.emit('createPresentor', {
        sdpOffer: sdp,
        // 邀请某人对话
        invite: nickname
      })
      // this.socket.emit('inviteViewer', { nickname })
    })
  }

  stop = () => {
    console.log('Stopping video call ...')
    if (this.webRtcPeer) {
      this.webRtcPeer.dispose()
      this.webRtcPeer = null
    }
    this.localVideo.removeEventListener('canplay', this._onVideoCanplay)
    this.socket.emit('stop')
    this.socket.close()
    this.emit('stop')
  }

  onIceCandidate = candidate => {
    console.log('Local candidate' + JSON.stringify(candidate))

    this.socket.emit('onIceCandidate', { candidate })
  }

  emit (name, ...args) {
    console.log(name, this.events)
    if (!Object.keys(this.events).includes(name)) return
    const cbs = this.events[name]
    return cbs.map(func => func(...args))
  }
  on (name, cb) {
    if (!Object.keys(this.events).includes(name)) return
    const cbs = this.events[name]
    if (cbs.includes(cb)) return
    cbs.push(cb)
    return this
  }
}

export default Presentor
