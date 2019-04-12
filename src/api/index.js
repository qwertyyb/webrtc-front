import http from '@/utils/fetch'

export const getLivingList = params => http.get('/api/v1/presentors', { params })

export const getVideoList = params => http.get('/api/v1/videos', { params })
