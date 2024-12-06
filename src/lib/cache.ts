import axios from 'axios'
import { setupCache, buildStorage } from 'axios-cache-interceptor'
import { CacheableMemory } from 'cacheable'

export let cache = new CacheableMemory({ useClone: false })

const storage = buildStorage({
  set: async (key, value, request) => {
    let ttl = Infinity

    if (
      request?.cache &&
      request.cache.ttl &&
      typeof request.cache.ttl === 'number'
    ) {
      ttl = request.cache.ttl
    }

    cache.set(key, value, ttl)
  },
  remove: async (key) => {
    cache.delete(key)
  },
  find: async (key) => {
    return cache.get(key)
  },
})

export const cacheAxios = setupCache(axios.create(), {
  storage,
})
