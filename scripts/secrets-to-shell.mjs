// Prints .env.secrets, decrypted, as `export KEY='value'` lines for a shell.
// Usage: node scripts/secrets-to-shell.mjs >> "$CLAUDE_ENV_FILE"
import { execFileSync } from 'node:child_process'

const json = execFileSync(
  'pnpm',
  ['exec', 'dotenvx', 'get', '-f', '.env.secrets', '--format', 'json'],
  { encoding: 'utf-8' }
)
const quote = (value) => `'${String(value).replaceAll("'", `'\\''`)}'`

for (const [key, value] of Object.entries(JSON.parse(json))) {
  if (!key.startsWith('DOTENV_')) {
    console.log(`export ${key}=${quote(value)}`)
  }
}
