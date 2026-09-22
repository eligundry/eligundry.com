import { describe, expect, test } from 'vitest'
import {
  decodeState,
  encodeState,
  parseOp,
  parseState,
  readHash,
} from './serialize'
import type { TailorState } from './state'

const state: TailorState = {
  v: 1,
  changes: [
    {
      id: 'c1',
      op: { type: 'rewrite', id: 'chord:0', markdown: 'Shipped **fast** – 🚀' },
      reason: 'Matches "velocity"',
      at: '2026-09-22T00:00:00.000Z',
    },
    {
      id: 'c2',
      op: {
        type: 'setPrint',
        print: { breakBefore: ['section:education'], fontScale: 0.95 },
      },
      reason: '',
      at: '2026-09-22T00:00:00.000Z',
    },
  ],
}

describe('serialize', () => {
  test('round-trips through the URL hash', async () => {
    const encoded = await encodeState(state)
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(await decodeState(encoded)).toEqual(state)
    expect(await readHash(`#foo=bar&t=${encoded}`)).toEqual(state)
  })

  test('ignores missing or garbage hashes', async () => {
    expect(await readHash('')).toBeNull()
    expect(await readHash('#t=not-valid')).toBeNull()
  })

  test('drops malformed changes but keeps valid ones', () => {
    const parsed = parseState({
      v: 1,
      changes: [
        state.changes[0],
        { id: 'c9', op: { type: 'rm -rf' }, reason: '', at: '' },
        { id: 'c10', op: { type: 'rewrite', id: 5 }, reason: '', at: '' },
      ],
    })
    expect(parsed.changes.map((c) => c.id)).toEqual(['c1'])
  })

  test('validates op fields', () => {
    expect(() => parseOp({ type: 'setVisibility', ids: ['x'] })).toThrow(
      /visible/
    )
    expect(() =>
      parseOp({ type: 'setPrint', print: { density: 'tiny' } })
    ).toThrow(/density/)
    expect(() =>
      parseOp({ type: 'rewrite', id: 'x', markdown: 'a'.repeat(5000) })
    ).toThrow(/at most/)
    expect(
      parseOp({
        type: 'setSkillKeywords',
        id: 'skills:x',
        keywords: ['Go', { name: 'Rust' }],
      })
    ).toEqual({
      type: 'setSkillKeywords',
      id: 'skills:x',
      keywords: [{ name: 'Go' }, { name: 'Rust', url: undefined }],
    })
  })
})
