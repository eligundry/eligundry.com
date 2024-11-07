import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/web'

export * from './schema'

export const client = createClient({
  url: import.meta.env.SECRET_TURSO_DB_URL,
  authToken: import.meta.env.SECRET_TURSO_DB_AUTH_TOKEN,
})
export const db = drizzle(client)
