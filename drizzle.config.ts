import { readFileSync } from 'node:fs'
import { defineConfig } from 'drizzle-kit'

// Same database the site uses: D1_DATABASE_ID, or the DB binding in
// wrangler.jsonc. drizzle-kit only generates migrations here; apply them with
// `pnpm drizzle:migration:apply`, which runs them through wrangler.
const databaseId =
  process.env.D1_DATABASE_ID ||
  readFileSync('wrangler.jsonc', 'utf-8').match(
    /"database_id":\s*"([^"]+)"/
  )?.[1]

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  schema: './src/lib/database/schema.ts',
  out: './migrations',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: databaseId!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
})
