import http from '@/utils/fetch'

export const getLivingList = params => http.get('/api/v1/presentors', { params })
