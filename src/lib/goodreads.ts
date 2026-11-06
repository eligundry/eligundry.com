import { sql } from 'drizzle-orm'
import { parse as csvParse } from 'csv-parse/sync'
import { db, goodreadsReviews } from './database'

type GoodreadsReviewRow = typeof goodreadsReviews.$inferInsert

/** A book as the public shelf widget shows it. */
export interface GoodreadsWidgetBook {
  /** Goodreads' book ID, from the cover image's file name. */
  bookId: string
  /** From the book's link, https://www.goodreads.com/review/show/<id> */
  reviewId: string | null
  title: string
  author: string
  cover: string
  shelf: string
  rating: number
  /** YYYY-MM-DD, for books rated recently enough to be in the updates widget */
  ratedAt: string | null
}

/** The review ID in a link like https://www.goodreads.com/review/show/9054277513 */
export function reviewIdFromURL(url: string): string | null {
  return url.match(/\/review\/show\/(\d+)/)?.[1] ?? null
}

// D1 can't run interactive transactions, so writes go out with db.batch, a
// statement per row, in chunks.
const BATCH_SIZE = 50

async function batchUpsert(
  rows: GoodreadsReviewRow[],
  set: Record<string, unknown>
) {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const statements = rows
      .slice(i, i + BATCH_SIZE)
      .map((row) =>
        db
          .insert(goodreadsReviews)
          .values(row)
          .onConflictDoUpdate({ target: goodreadsReviews.bookId, set })
      )
    const [first, ...rest] = statements
    if (first) await db.batch([first, ...rest])
  }
}

const now = sql`(cast(strftime('%s', 'now') as int))`
const excluded = (column: string) => sql.raw(`excluded.\`${column}\``)

/**
 * Save the books that the shelf widget shows. This only updates what the
 * widget knows, so it never blanks out the review text or reading dates that
 * came from a CSV import.
 */
export async function saveWidgetBooks(books: GoodreadsWidgetBook[]) {
  await batchUpsert(
    books.map((book) => ({ ...book, reviewId: book.reviewId ?? undefined })),
    {
      reviewId: sql`coalesce(${excluded('reviewId')}, ${goodreadsReviews.reviewId})`,
      title: excluded('title'),
      author: excluded('author'),
      cover: excluded('cover'),
      shelf: excluded('shelf'),
      rating: excluded('rating'),
      // The updates widget only knows the last 10 updates, so keep older dates
      ratedAt: sql`coalesce(${excluded('ratedAt')}, ${goodreadsReviews.ratedAt})`,
      updatedAt: now,
    }
  )
}

/** "2024/03/15" as "2024-03-15", or null for an empty cell. */
function csvDate(value: string): string | null {
  const match = value.trim().match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/)
  if (!match) return null
  const [, year, month, day] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

/** Goodreads writes ISBNs as spreadsheet formulas like ="9780593298039". */
function csvISBN(value: string): string | null {
  const digits = value.replace(/^="?|"$/g, '').trim()
  return digits || null
}

function csvInt(value: string): number | null {
  const number = Number.parseInt(value, 10)
  return Number.isNaN(number) ? null : number
}

/**
 * The rows of a Goodreads library export (My Books > Import and export >
 * Export library). The "Private Notes" column is left out on purpose.
 */
export function parseGoodreadsCSV(csv: string): GoodreadsReviewRow[] {
  const records: Record<string, string>[] = csvParse(csv, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    relax_column_count: true,
  })

  return records.map((record, index) => {
    const bookId = record['Book Id']?.trim()
    const title = record['Title']?.trim()
    const author = record['Author']?.trim()
    if (!bookId || !title || !author) {
      throw new Error(
        `Row ${index + 2} of the Goodreads export is missing its Book Id, Title, or Author`
      )
    }

    return {
      bookId,
      title,
      author,
      shelf: record['Exclusive Shelf']?.trim() || 'read',
      rating: csvInt(record['My Rating'] ?? '') ?? 0,
      review: record['My Review']?.trim() || null,
      spoiler: record['Spoiler']?.trim().toLowerCase() === 'true',
      dateRead: csvDate(record['Date Read'] ?? ''),
      dateAdded: csvDate(record['Date Added'] ?? ''),
      isbn13: csvISBN(record['ISBN13'] ?? ''),
      pages: csvInt(record['Number of Pages'] ?? ''),
      yearPublished:
        csvInt(record['Original Publication Year'] ?? '') ??
        csvInt(record['Year Published'] ?? ''),
    }
  })
}

/**
 * Save the rows of a Goodreads export. The export is the source of truth for
 * everything in it, and it keeps the cover, review ID, and rating date that
 * only the widgets know.
 */
export async function saveCSVRows(rows: GoodreadsReviewRow[]) {
  await batchUpsert(rows, {
    title: excluded('title'),
    author: excluded('author'),
    shelf: excluded('shelf'),
    rating: excluded('rating'),
    review: excluded('review'),
    spoiler: excluded('spoiler'),
    dateRead: excluded('dateRead'),
    dateAdded: excluded('dateAdded'),
    isbn13: excluded('isbn13'),
    pages: excluded('pages'),
    yearPublished: excluded('yearPublished'),
    updatedAt: now,
  })
}
