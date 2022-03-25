import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'

export const cache = setupCache({
  maxAge: 60 * 60 * 1000,
})

export const cacheAxios = axios.create({
  adapter: cache.adapter,
})
