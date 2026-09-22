import { describe, expect, test } from 'vitest'
import {
  joinWithAnd,
  markdownToPlain,
  renderInlineMarkdown,
  skillLineHtml,
} from './markdown'

describe('markdownToPlain', () => {
  test('strips links, inline HTML, emphasis and entities', () => {
    expect(
      markdownToPlain(
        'Raised <a href="x"><abbr title="Net Promoter Score">NPS</abbr></a>\n  25 points & used [React](https://reactjs.org/) &amp; **Go**'
      )
    ).toBe('Raised NPS 25 points & used React & Go')
  })

  test('leaves snake_case words alone', () => {
    expect(markdownToPlain('uses some_var_name')).toBe('uses some_var_name')
  })
})

describe('renderInlineMarkdown', () => {
  test('renders links, bold, italics and code', () => {
    expect(
      renderInlineMarkdown(
        'Used [React](https://reactjs.org/) **a lot**, *daily* with `tsx`'
      )
    ).toBe(
      'Used <a href="https://reactjs.org/">React</a> <strong>a lot</strong>, <em>daily</em> with <code>tsx</code>'
    )
  })

  test('escapes HTML', () => {
    expect(
      renderInlineMarkdown('<img src=x onerror=alert(1)> & <b>hi</b>')
    ).toBe('&lt;img src=x onerror=alert(1)&gt; &amp; &lt;b&gt;hi&lt;/b&gt;')
  })

  test('drops unsafe link targets', () => {
    expect(renderInlineMarkdown('[click](javascript:alert(1))')).not.toContain(
      '<a'
    )
    expect(renderInlineMarkdown('[x](" onmouseover="alert(1))')).not.toContain(
      'onmouseover="'
    )
  })

  test('does not format inside code spans', () => {
    expect(renderInlineMarkdown('`**not bold**`')).toBe(
      '<code>**not bold**</code>'
    )
  })
})

describe('skill lines', () => {
  test('joins keywords with an Oxford comma', () => {
    expect(joinWithAnd(['a'])).toBe('a')
    expect(joinWithAnd(['a', 'b'])).toBe('a and b')
    expect(joinWithAnd(['a', 'b', 'c'])).toBe('a, b, and c')
  })

  test('renders linked keywords', () => {
    expect(
      skillLineHtml('Fluent in', [
        { name: 'TypeScript', url: 'https://www.typescriptlang.org/' },
        { name: 'Go' },
      ])
    ).toBe(
      'Fluent in <a href="https://www.typescriptlang.org/" itemprop="knowsAbout" target="_blank">TypeScript</a> and <span itemprop="knowsAbout">Go</span>.'
    )
  })
})
