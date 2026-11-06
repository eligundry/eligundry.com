import { readFileSync, readdirSync } from 'node:fs'
import { beforeAll, expect, test, vi } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './database/schema'

// Run the real queries against an in-memory SQLite database built from the
// migrations, instead of the remote database.
const client = createClient({ url: 'file::memory:' })
vi.mock('./database', () => ({ ...schema, db: drizzle(client) }))

const { default: daylio } = await import('./daylio')

beforeAll(async () => {
  for (const file of readdirSync('migrations').filter((f) =>
    f.endsWith('.sql')
  )) {
    await client.executeMultiple(readFileSync(`migrations/${file}`, 'utf-8'))
  }
})

// 40 entries, more than fit in one chunk of the batched upsert
const days = Array.from({ length: 40 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 0, 1 + i))
  return date.toISOString().slice(0, 10)
})

const csv = [
  'full_date,date,weekday,time,mood,activities,scales,note_title,note',
  ...days.map((day, i) =>
    [
      day,
      day,
      'Monday',
      '12:00',
      i === 0 ? 'rad' : 'good',
      i === 0 ? '"cook | drank"' : 'relax',
      '',
      '',
      i === 0 ? '"- made soup - had wine #private"' : '',
    ].join(',')
  ),
].join('\n')

test('processCSV saves every entry and its activities in one batch', async () => {
  const entries = await daylio.processCSV(Buffer.from(csv))
  expect(entries).toHaveLength(40)

  const rows = await client.execute(
    'select (select count(*) from daylio_entries) as entries, (select count(*) from daylio_entry_activities) as links, (select count(*) from daylio_activities) as activities'
  )
  expect(rows.rows[0]).toMatchObject({ entries: 40, links: 41, activities: 3 })

  // Uploading the same export again updates in place
  await daylio.processCSV(Buffer.from(csv))
  const again = await client.execute('select count(*) as n from daylio_entries')
  expect(again.rows[0].n).toBe(40)
})

test('getUnpublished returns raw markdown without private lines', async () => {
  const unpublished = await daylio.getUnpublished()
  expect(unpublished).toHaveLength(40)

  const withNote = unpublished.find((entry) => entry.mood === 'rad')
  expect(withNote?.markdown).toBe('- made soup')
  expect(daylio.tweetPrefix(withNote!, withNote!.time)).toBe(
    'Today, I felt rad'
  )

  await daylio.markAllEntriesAsPublished()
  expect(await daylio.getUnpublished()).toHaveLength(0)
})

test('getAll renders notes to HTML', async () => {
  const entry = (await daylio.getAll()).find((e) => e.mood === 'rad')
  expect(entry?.note?.markdown).toBe('- made soup')
  expect(entry?.note?.html).toContain('<li>made soup</li>')
})
