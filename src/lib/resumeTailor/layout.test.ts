import { describe, expect, test } from 'vitest'
import { paginate, type Unit } from './layout'

const unit = (
  id: string,
  top: number,
  height: number,
  extra: Partial<Unit> = {}
): Unit => ({
  id,
  top,
  height,
  avoidBreakInside: true,
  breakBefore: false,
  isHeading: false,
  ...extra,
})

describe('paginate', () => {
  test('fits everything on one page', () => {
    const layout = paginate([unit('a', 0, 100), unit('b', 100, 100)], 1000)
    expect(layout.pageCount).toBe(1)
    expect(layout.pages).toEqual([{ page: 1, ids: ['a', 'b'] }])
    expect(layout.lastPageFillPercent).toBe(20)
  })

  test('pushes unbreakable blocks to the next page and reports the gap', () => {
    const layout = paginate(
      [unit('a', 0, 700), unit('b', 700, 400), unit('c', 1100, 100)],
      1000
    )
    expect(layout.pages).toEqual([
      { page: 1, ids: ['a'] },
      { page: 2, ids: ['b', 'c'] },
    ])
    expect(layout.pushed).toEqual([
      { id: 'b', toPage: 2, gapPx: 300, gapPercent: 30 },
    ])
    expect(layout.lastPageFillPercent).toBe(50)
    expect(layout.hints.join(' ')).toMatch(/b was pushed to page 2/)
  })

  test('splits breakable blocks', () => {
    const layout = paginate(
      [unit('a', 0, 900), unit('b', 900, 300, { avoidBreakInside: false })],
      1000
    )
    expect(layout.splits).toEqual([{ id: 'b', page: 1, continuesOnPage: 2 }])
    expect(layout.pageCount).toBe(2)
  })

  test('honors forced breaks', () => {
    const layout = paginate(
      [unit('a', 0, 100), unit('b', 100, 100, { breakBefore: true })],
      1000
    )
    expect(layout.pages).toEqual([
      { page: 1, ids: ['a'] },
      { page: 2, ids: ['b'] },
    ])
  })

  test('finds headings stranded at the bottom of a page', () => {
    const layout = paginate(
      [
        unit('a', 0, 900),
        unit('section:education:title', 900, 40, { isHeading: true }),
        unit('kent', 940, 200),
      ],
      1000
    )
    expect(layout.orphanedHeadings).toEqual([
      { id: 'section:education:title', page: 1 },
    ])
  })

  test('reports blocks that end under the print footer', () => {
    const layout = paginate([unit('a', 0, 500), unit('b', 500, 480)], 1000, {
      footerHeight: 30,
    })
    expect(layout.pageCount).toBe(1)
    expect(layout.footerOverlaps).toEqual([{ id: 'b', page: 1, overlapPx: 10 }])
  })

  test('flags going over the target page count', () => {
    const layout = paginate([unit('a', 0, 900), unit('b', 900, 300)], 1000, {
      targetPages: 1,
    })
    expect(layout.hints.join(' ')).toMatch(/2 pages but should be 1/)
  })
})
