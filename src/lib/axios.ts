import axios from 'axios'
import iconv from 'iconv-lite'

import { IWASHER_BASE_URL } from '@/const/iwasher'

const Cookie = [
  { key: 'u_n', value: process.env.IWASHER_USERNAME },
  { key: 'u_p', value: process.env.IWASHER_PASSWORD },
  { key: 'u_s', value: '-OK-' },
]
  .map(({ key, value }) => `${key}=${value}`)
  .join('; ')

export const IWasherInstance = axios.create({
  baseURL: IWASHER_BASE_URL,
  headers: { Cookie },
  responseType: 'arraybuffer',
})

IWasherInstance.interceptors.response.use((response) => {
  response.data = iconv.decode(response.data, 'tis-620')
  return response
})

IWasherInstance.interceptors.request.use((config) => {
  return config
})
