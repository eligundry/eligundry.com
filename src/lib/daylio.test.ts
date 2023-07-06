import { test, assert } from 'vitest'

import { colloquialDifferenceInDays } from '../lib/daylio'

test.each([
  ['2023-01-15T10:00:00-05:00', '2023-01-14T21:30:00-05:00', 1],
  ['2023-02-15T10:00:00-05:00', '2023-02-15T09:00:00-05:00', 0],
  ['2023-04-15T01:00:00-04:00', '2023-04-14T23:59:00-04:00', 0],
  ['2023-04-15T05:00:00-04:00', '2023-04-14T23:59:00-04:00', 0],
  ['2023-04-15T08:00:00-04:00', '2023-04-14T23:59:00-04:00', 1],
])('colloquialDifferenceInDays(%s, %s) === %d', (later, earlier, expected) => {
  assert.equal(
    colloquialDifferenceInDays(new Date(later), new Date(earlier)),
    expected
  )
})
