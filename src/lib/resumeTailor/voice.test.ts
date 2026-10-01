import { describe, expect, test } from 'vitest'
import { checkAgentMarkdown } from './voice'

const technologies = [
  { name: 'Go', url: 'https://golang.org/' },
  { name: 'ClickHouse', url: 'https://clickhouse.com/' },
]

describe('checkAgentMarkdown', () => {
  test('rejects bold and italics', () => {
    for (const markdown of [
      '**a**',
      '__a__',
      '*a*',
      '_a_',
      '[**a**](https://x.dev)',
    ]) {
      expect(() => checkAgentMarkdown(markdown, {})).toThrow(/Bold and italics/)
    }
  })

  test('accepts plain text with linked technologies', () => {
    expect(
      checkAgentMarkdown(
        'Cut query time in half by moving reports to [ClickHouse](https://clickhouse.com/).',
        { technologies }
      )
    ).toEqual([])
  })

  test('warns about technologies that are not linked', () => {
    const [warning] = checkAgentMarkdown(
      'Moved reports to ClickHouse, then wrote a Go service. Let it go.',
      { technologies }
    )
    expect(warning).toBe(
      'Link these technologies: Go (https://golang.org/), ClickHouse (https://clickhouse.com/). Every technology named on the resume is a link.'
    )
    expect(checkAgentMarkdown('Let it go.', { technologies })).toEqual([])
  })

  test('warns about filler words and rewrites that grow too much', () => {
    expect(
      checkAgentMarkdown(
        'Leveraged dynamic synergies to ship a lot more things.',
        {
          original: 'Shipped things.',
        }
      )
    ).toEqual([
      `"leveraged", "synergies", "dynamic" reads as filler. Use Eli's plain wording instead.`,
      expect.stringMatching(/^This is \d+% longer than the original/),
    ])
  })
})
