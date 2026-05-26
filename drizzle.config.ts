import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'turso',
  schema: './src/lib/database/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.SECRET_TURSO_DB_URL!,
    authToken: process.env.SECRET_TURSO_DB_AUTH_TOKEN!,
  },
})
