/**
 * Backfill the goodreads_reviews table from a Goodreads library export
 * (My Books > Import and export > Export library). Safe to re-run: rows are
 * upserted by book ID. Don't commit the export.
 *
 * Run with:  pnpm goodreads:import ~/Downloads/goodreads_library_export.csv
 * Reaches D1 with the Cloudflare credentials in .env.secrets.
 */
import { readFileSync } from 'node:fs'
import { parseGoodreadsCSV, saveCSVRows } from '../../src/lib/goodreads'

const file = process.argv[2]
if (!file) {
  console.error('Usage: pnpm goodreads:import <goodreads_library_export.csv>')
  process.exit(1)
}

const rows = parseGoodreadsCSV(readFileSync(file, 'utf-8'))
await saveCSVRows(rows)

const reviews = rows.filter((row) => row.review).length
console.log(`Saved ${rows.length} books, ${reviews} with a written review`)
