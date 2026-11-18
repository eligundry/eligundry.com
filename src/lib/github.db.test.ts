import { readFileSync } from 'node:fs'
import { afterEach, beforeAll, expect, test, vi } from 'vitest'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './database/schema'

// Run the real upserts against an in-memory SQLite database built from the
// migration, instead of the remote database.
const client = createClient({ url: 'file::memory:' })
vi.mock('./database', () => ({ ...schema, db: drizzle(client) }))

const { saveContributions, loadContributions, lastYearOfContributions } =
  await import('./github')

beforeAll(async () => {
  await client.executeMultiple(
    readFileSync('migrations/0007_github_contributions.sql', 'utf-8')
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('a day keeps its highest count when GitHub forgets contributions', async () => {
  await saveContributions([
    { date: '2026-01-01', count: 12, level: 3 },
    { date: '2026-01-02', count: 1, level: 1 },
  ])
  // After leaving a job, GitHub drops the private contributions
  await saveContributions([
    { date: '2026-01-01', count: 2, level: 1 },
    { date: '2026-01-02', count: 4, level: 2 },
    { date: '2026-01-03', count: 0, level: 0 },
  ])

  expect(await loadContributions('2026-01-01', '2026-01-03')).toEqual([
    { date: '2026-01-01', count: 12, level: 3 },
    { date: '2026-01-02', count: 4, level: 2 },
    { date: '2026-01-03', count: 0, level: 0 },
  ])
})

test('the calendar comes from the database, even when GitHub is down', async () => {
  await saveContributions([{ date: '2026-03-01', count: 9, level: 4 }])

  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        total: { lastYear: 1 },
        contributions: [
          { date: '2099-01-01', count: 0, level: 0 },
          { date: '2026-03-02', count: 1, level: 1 },
          { date: '2026-03-01', count: 0, level: 0 },
          { date: '2026-02-28', count: 0, level: 0 },
        ],
      })
    )
  )
  expect(await lastYearOfContributions('eligundry')).toEqual([
    { date: '2026-02-28', count: 0, level: 0 },
    { date: '2026-03-01', count: 9, level: 4 },
    { date: '2026-03-02', count: 1, level: 1 },
  ])

  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(null, { status: 503 }))
  )
  const days = await lastYearOfContributions('eligundry')
  // A year up to the last saved day, with unsaved days as zeros
  expect(days[0]).toEqual({ date: '2025-03-02', count: 0, level: 0 })
  expect(days.at(-1)).toEqual({ date: '2026-03-02', count: 1, level: 1 })
  expect(days.find((d) => d.date === '2026-03-01')?.count).toBe(9)
}, 20000)
