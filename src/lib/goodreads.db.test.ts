import { readFileSync } from 'node:fs'
import { beforeAll, expect, test, vi } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './database/schema'

// Run the real upserts against an in-memory SQLite database built from the
// migrations, instead of the remote database.
const client = createClient({ url: 'file::memory:' })
vi.mock('./database', () => ({ ...schema, db: drizzle(client) }))

const { saveWidgetBooks, saveCSVRows } = await import('./goodreads')
const { db } = await import('./database')

beforeAll(async () => {
  const sql = readFileSync('migrations/0003_tense_dormammu.sql', 'utf-8')
  await client.executeMultiple(sql)
})

const widgetBook = {
  bookId: '243042929',
  reviewId: '9054277513',
  title: 'Cool Machine (The Harlem Trilogy, #3)',
  author: 'Colson Whitehead',
  cover: 'https://example.com/243042929.jpg',
  shelf: 'currently-reading',
  rating: 0,
  ratedAt: null,
}

test('widget saves and CSV imports merge without losing each other’s fields', async () => {
  await saveWidgetBooks([widgetBook])
  await saveWidgetBooks([
    { ...widgetBook, shelf: 'read', rating: 5, ratedAt: '2026-10-29' },
  ])

  await saveCSVRows([
    {
      bookId: '243042929',
      title: 'Cool Machine (The Harlem Trilogy, #3)',
      author: 'Colson Whitehead',
      shelf: 'read',
      rating: 5,
      review: 'So good.',
      dateRead: '2026-10-29',
    },
    { bookId: '1', title: 'Old Book', author: 'Someone', shelf: 'read' },
  ])

  // A later build, after the book fell out of the updates widget
  await saveWidgetBooks([{ ...widgetBook, shelf: 'read', rating: 4 }])

  const rows = await db
    .select()
    .from(schema.goodreadsReviews)
    .orderBy(schema.goodreadsReviews.bookId)

  expect(rows).toHaveLength(2)
  expect(rows[1]).toMatchObject({
    bookId: '243042929',
    reviewId: '9054277513',
    cover: 'https://example.com/243042929.jpg',
    shelf: 'read',
    rating: 4,
    ratedAt: '2026-10-29',
    review: 'So good.',
    dateRead: '2026-10-29',
    spoiler: false,
  })
  expect(rows[0]).toMatchObject({
    bookId: '1',
    cover: null,
    rating: 0,
    review: null,
  })
})
