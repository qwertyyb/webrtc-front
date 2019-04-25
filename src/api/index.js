import http from '@/utils/fetch'

export const getLivingList = params => http.get('presentors', { params })

export const getVideoList = params => http.get('videos', { params })

export const login = data => http.post('user/login', data)

export const register = data => http.post('user/register', data)
