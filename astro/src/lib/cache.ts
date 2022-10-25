import axios from 'axios'
import { setupCache, buildStorage } from 'axios-cache-interceptor'
import { caching } from 'cache-manager'
import fsStore from 'cache-manager-fs-hash'

const defaultTTL = 60 * 60 * 1000
export const cache = caching({
  store: fsStore,
  ttl: defaultTTL,
  options: {
    path: '.cache',
    ttl: defaultTTL,
    subdirs: true,
  },
})

const storage = buildStorage({
  set: async (key, value, request) => {
    let ttl = defaultTTL

    if (
      request?.cache &&
      request.cache.ttl &&
      typeof request.cache.ttl === 'number'
    ) {
      ttl = request.cache.ttl
    }

    await cache.set(key, value, ttl)
  },
  remove: async (key) => {
    await cache.del(key)
  },
  find: async (key) => {
    return cache.get(key)
  },
})

export const cacheAxios = setupCache(axios.create(), {
  storage,
})
