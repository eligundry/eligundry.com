import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import {
  drizzle as drizzleProxy,
  type AsyncBatchRemoteCallback,
  type SqliteRemoteDatabase,
} from 'drizzle-orm/sqlite-proxy'
import wranglerConfig from '../../../wrangler.jsonc?raw'

export * from './schema'

/**
 * The site's D1 database.
 *
 * Inside the Worker it's the `DB` binding. Everywhere else runs in Node: the
 * build (content loaders and prerendered pages), vite-node scripts and
 * drizzle-kit. Those reach the same database through D1's HTTP API, using
 * CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN. D1_DATABASE_ID points them at
 * another database, such as a pull request's copy; it defaults to the one in
 * wrangler.jsonc.
 */
export type Database = SqliteRemoteDatabase

const isWorkerd =
  typeof navigator !== 'undefined' &&
  navigator.userAgent === 'Cloudflare-Workers'

async function workerDatabase(): Promise<Database> {
  // A variable specifier keeps Vite and Node from trying to resolve this
  // workerd built-in outside of the Worker.
  const specifier = 'cloudflare:workers'
  const { env } = await import(/* @vite-ignore */ specifier)
  return drizzleD1(env.DB) as unknown as Database
}

/** The database ID from wrangler.jsonc's DB binding. */
function configuredDatabaseId() {
  return wranglerConfig.match(/"database_id":\s*"([^"]+)"/)?.[1]
}

interface RawResult {
  results: { columns: string[]; rows: unknown[][] }
}

function httpDatabase(): Database {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_API_TOKEN
  const databaseId = process.env.D1_DATABASE_ID || configuredDatabaseId()
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`

  async function query(body: unknown): Promise<RawResult[]> {
    if (!accountId || !token) {
      throw new Error(
        'CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set to reach D1'
      )
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const json = (await resp.json()) as {
      success: boolean
      errors: { message: string }[]
      result: RawResult[]
    }

    if (!json.success) {
      throw new Error(
        `D1 query failed: ${json.errors.map((e) => e.message).join('; ')}`
      )
    }

    return json.result
  }

  const rowsFor = (method: string, result: RawResult) =>
    method === 'get' ? result.results.rows[0] : result.results.rows

  return drizzleProxy(
    async (sql, params, method) => {
      const [result] = await query({ sql, params })
      return { rows: rowsFor(method, result) as any }
    },
    (async (queries) => {
      // A batch request runs as one transaction on D1
      const results = await query({
        batch: queries.map(({ sql, params }) => ({ sql, params })),
      })
      return results.map((result, i) => ({
        rows: rowsFor(queries[i].method, result) as any,
      }))
    }) satisfies AsyncBatchRemoteCallback
  ) as unknown as Database
}

export const db: Database = isWorkerd ? await workerDatabase() : httpDatabase()
