import Vue from 'vue'
import Vuex from 'vuex'
import { login } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  },
  mutations: {
    updateToken (state, token) {
      state.token = token
    },
    updateUserInfo (state, userInfo) {
      state.userInfo = {
        ...userInfo
      }
    },
    clearAuthState (state) {
      state.token = ''
      state.userInfo = {}
      localStorage.setItem('token', '')
      localStorage.setItem('userInfo', '{}')
    }
  },
  actions: {
    login ({ commit }, { nickname, password }) {
      return login({ nickname, password }).then(({ data }) => {
        commit('updateToken', data.token)
        commit('updateUserInfo', data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.user))
        return data
      })
    }
  }
})
