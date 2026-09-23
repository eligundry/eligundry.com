import { describe, expect, test } from 'vitest'
import { joinWithAnd, markdownToPlain, renderMarkdown } from './markdown'

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

describe('renderMarkdown', () => {
  test('renders inline markdown without a wrapping paragraph', () => {
    expect(
      renderMarkdown(
        'Used [React](https://reactjs.org/) **a lot**, *daily* with `tsx`',
        { trusted: false }
      )
    ).toBe(
      'Used <a href="https://reactjs.org/">React</a> <strong>a lot</strong>, <em>daily</em> with <code>tsx</code>'
    )
  })

  test('keeps paragraphs when there are several', () => {
    expect(renderMarkdown('One\n\nTwo', { trusted: false })).toBe(
      '<p>One</p>\n<p>Two</p>'
    )
  })

  test('keeps inline HTML in trusted content', () => {
    expect(
      renderMarkdown('<abbr title="Single Sign On">SSO</abbr> & more', {
        trusted: true,
      })
    ).toBe('<abbr title="Single Sign On">SSO</abbr> &amp; more')
  })

  test('escapes HTML in untrusted content', () => {
    expect(
      renderMarkdown('<img src=x onerror=alert(1)> <b>hi</b>', {
        trusted: false,
      })
    ).toBe('&lt;img src=x onerror=alert(1)&gt; &lt;b&gt;hi&lt;/b&gt;')
  })

  test('drops unsafe link targets', () => {
    expect(
      renderMarkdown('[click](javascript:alert(1))', { trusted: false })
    ).not.toContain('javascript:')
  })

  test('does not format inside code spans', () => {
    expect(renderMarkdown('`**not bold**`', { trusted: false })).toBe(
      '<code>**not bold**</code>'
    )
  })
})

describe('joinWithAnd', () => {
  test('joins with an Oxford comma', () => {
    expect(joinWithAnd(['a'])).toBe('a')
    expect(joinWithAnd(['a', 'b'])).toBe('a and b')
    expect(joinWithAnd(['a', 'b', 'c'])).toBe('a, b, and c')
  })
})
