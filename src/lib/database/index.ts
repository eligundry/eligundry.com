import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/web'

export * from './schema'

// Prefer Vite's import.meta.env (Astro runtime/build) but fall back to
// process.env so standalone scripts run via vite-node can connect too.
export const client = createClient({
  url: import.meta.env.SECRET_TURSO_DB_URL ?? process.env.SECRET_TURSO_DB_URL,
  authToken:
    import.meta.env.SECRET_TURSO_DB_AUTH_TOKEN ??
    process.env.SECRET_TURSO_DB_AUTH_TOKEN,
})
export const db = drizzle(client)
