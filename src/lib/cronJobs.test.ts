import { describe, expect, it } from 'vitest'
import { jobsDueAt } from './cronJobs'

describe('jobsDueAt', () => {
  it('posts the weekly collage at noon on Friday in New York, not Thursday', () => {
    // Thursday 2026-11-19 12:00 EST, when the old `0 17 * * 5` cron fired
    expect(jobsDueAt(new Date('2026-11-19T17:00:00Z'))).toEqual([])
    // Friday 2026-11-20 12:00 EST
    expect(jobsDueAt(new Date('2026-11-20T17:00:00Z'))).toEqual([
      { kind: 'collage', period: '7day' },
    ])
    // Friday 2026-11-20 11:00 EST, the other UTC hour the cron fires at
    expect(jobsDueAt(new Date('2026-11-20T16:00:00Z'))).toEqual([])
  })

  it('follows daylight saving time', () => {
    // Friday 2026-07-10 12:00 EDT is 16:00 UTC
    expect(jobsDueAt(new Date('2026-07-10T16:00:00Z'))).toEqual([
      { kind: 'collage', period: '7day' },
    ])
    // ...and 13:00 EDT is 17:00 UTC
    expect(jobsDueAt(new Date('2026-07-10T17:00:00Z'))).toEqual([])
  })

  it('posts the monthly and yearly collages on the first', () => {
    // Tuesday 2026-12-01 12:00 EST
    expect(jobsDueAt(new Date('2026-12-01T17:00:00Z'))).toEqual([
      { kind: 'collage', period: '1month' },
    ])
    // Friday 2027-01-01 12:00 EST
    expect(jobsDueAt(new Date('2027-01-01T17:00:00Z'))).toEqual([
      { kind: 'collage', period: '7day' },
      { kind: 'collage', period: '1month' },
      { kind: 'collage', period: '12month' },
    ])
  })

  it('runs the nightly check at 11pm in New York', () => {
    // 2026-11-19 23:00 EST
    expect(jobsDueAt(new Date('2026-11-20T04:00:00Z'))).toEqual([
      { kind: 'nightly' },
    ])
    // 2026-07-10 23:00 EDT
    expect(jobsDueAt(new Date('2026-07-11T03:00:00Z'))).toEqual([
      { kind: 'nightly' },
    ])
    expect(jobsDueAt(new Date('2026-11-20T03:00:00Z'))).toEqual([])
  })
})
