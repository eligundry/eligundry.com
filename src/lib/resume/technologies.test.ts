import { describe, expect, test } from 'vitest'
import {
  collectTechnologies,
  markTechnologyLinks,
  technologyKey,
} from './technologies'

describe('technologies', () => {
  test('ignores www, protocol, case and trailing slashes', () => {
    expect(technologyKey('https://www.PostgreSQL.org/')).toBe('postgresql.org')
    expect(technologyKey('http://postgresql.org')).toBe('postgresql.org')
    expect(technologyKey('not a url')).toBeUndefined()
  })

  test('collects skills and links from jobs, but not links to the employer', () => {
    const technologies = collectTechnologies({
      skills: [
        {
          keywords: [
            { name: 'React', url: 'https://reactjs.org/' },
            { name: 'Vim' },
          ],
        },
      ],
      experiences: [
        {
          url: 'https://chord.co',
          highlights: [
            {
              markdown:
                'Built a [React SDK](https://docs.chord.co/sdk) with [React](https://www.reactjs.org) and [Typedoc](https://typedoc.org/).',
            },
          ],
        },
      ],
    })
    expect(technologies).toEqual([
      { name: 'React', url: 'https://reactjs.org/' },
      { name: 'Typedoc', url: 'https://typedoc.org/' },
    ])
  })

  test('marks links to technologies as knowsAbout', () => {
    const technologies = [{ name: 'React', url: 'https://reactjs.org/' }]
    expect(
      markTechnologyLinks(
        '<a href="https://www.reactjs.org">React</a> <a href="https://x.dev">X</a> <a itemprop="url" href="https://reactjs.org/">R</a>',
        technologies
      )
    ).toBe(
      '<a href="https://www.reactjs.org" itemprop="knowsAbout">React</a> <a href="https://x.dev">X</a> <a itemprop="url" href="https://reactjs.org/">R</a>'
    )
  })
})
