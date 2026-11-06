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
  for (const migration of [
    '0003_tense_dormammu.sql',
    '0004_fancy_killer_shrike.sql',
  ]) {
    await client.executeMultiple(
      readFileSync(`migrations/${migration}`, 'utf-8')
    )
  }
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

test('the export wins over the widgets, which only fill in what it lacks', async () => {
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

  // A later build, after the book fell out of the updates widget, with
  // widget data that disagrees with the export
  await saveWidgetBooks([
    { ...widgetBook, title: 'Cool Machine', shelf: 'read', rating: 4 },
    {
      ...widgetBook,
      bookId: '2',
      reviewId: null,
      title: 'Widget Only',
      shelf: 'read',
      rating: 3,
    },
  ])
  await saveWidgetBooks([
    {
      ...widgetBook,
      bookId: '2',
      title: 'Widget Only',
      shelf: 'read',
      rating: 2,
    },
  ])

  const rows = await db
    .select()
    .from(schema.goodreadsReviews)
    .orderBy(schema.goodreadsReviews.bookId)

  expect(rows).toHaveLength(3)
  expect(rows[2]).toMatchObject({
    bookId: '243042929',
    reviewId: '9054277513',
    title: 'Cool Machine (The Harlem Trilogy, #3)',
    cover: 'https://example.com/243042929.jpg',
    shelf: 'read',
    rating: 5,
    ratedAt: '2026-10-29',
    review: 'So good.',
    dateRead: '2026-10-29',
    spoiler: false,
  })
  expect(rows[2].importedAt).toBeInstanceOf(Date)
  expect(rows[0]).toMatchObject({
    bookId: '1',
    cover: null,
    rating: 0,
    review: null,
  })
  // Books the export hasn't covered keep following the widget
  expect(rows[1]).toMatchObject({
    bookId: '2',
    rating: 2,
    importedAt: null,
  })
})
