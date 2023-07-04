import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

export * from './schema'

export const client = createClient({
  url: process.env.SECRET_TURSO_DB_URL,
  authToken: process.env.SECRET_TURSO_DB_AUTH_TOKEN,
})
export const db = drizzle(client)
