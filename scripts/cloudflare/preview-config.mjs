// Writes dist/server/wrangler.preview.json: the built Worker config with its
// DB binding pointed at another database (a pull request's copy) and no cron
// triggers. Usage: node scripts/cloudflare/preview-config.mjs <database-id>
import { readFileSync, writeFileSync } from 'node:fs'

const [databaseId] = process.argv.slice(2)
if (!databaseId) {
  throw new Error('Usage: preview-config.mjs <database-id>')
}

const config = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf-8'))
config.d1_databases = config.d1_databases.map((db) =>
  db.binding === 'DB'
    ? { ...db, database_id: databaseId, database_name: undefined }
    : db
)
config.triggers = { crons: [] }
writeFileSync('dist/server/wrangler.preview.json', JSON.stringify(config))
