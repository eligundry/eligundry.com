import { describe, expect, test } from 'vitest'
import { moveBefore } from './useBulletDrag'

describe('moveBefore', () => {
  const ids = ['a', 'b', 'c']

  test('moves an id before another, or to the end', () => {
    expect(moveBefore(ids, 'c', 'a')).toEqual(['c', 'a', 'b'])
    expect(moveBefore(ids, 'a', 'c')).toEqual(['b', 'a', 'c'])
    expect(moveBefore(ids, 'a', 'end')).toEqual(['b', 'c', 'a'])
  })

  test('dropping next to itself keeps the order', () => {
    expect(moveBefore(ids, 'b', 'b')).toEqual(ids)
    expect(moveBefore(ids, 'b', 'c')).toEqual(ids)
  })
})
