import axios from 'axios'
import { setupCache, buildStorage } from 'axios-cache-interceptor'
import { caching, MemoryCache, Cache } from 'cache-manager'
import sqliteStore, { SqliteCacheAdapter } from 'cache-manager-better-sqlite3'
import path from 'path'

export let cache: Promise<MemoryCache | Cache<SqliteCacheAdapter>> =
  caching('memory')

if (!process.env.NETLIFY) {
  cache = caching(sqliteStore, {
    path: path.join(process.cwd(), '.cache', 'cache.db'),
  })
}

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

    const c = await cache
    await c.set(key, value, ttl)
  },
  remove: async (key) => {
    const c = await cache
    await c.del(key)
  },
  find: async (key) => {
    const c = await cache
    return c.get(key)
  },
})

export const cacheAxios = setupCache(axios.create(), {
  storage,
})
