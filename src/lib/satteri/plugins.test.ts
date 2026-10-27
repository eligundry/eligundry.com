import { describe, expect, it } from 'vitest'
import { markdownToHtml } from 'satteri'
import hastAccessibleEmojis from './hast-accessible-emojis'
import hastUnwrapImages from './hast-unwrap-images'
import mdastStripPrivate from './mdast-strip-private'

describe('hastAccessibleEmojis', () => {
  const render = async (md: string) =>
    (
      await markdownToHtml(md, { hastPlugins: [hastAccessibleEmojis] })
    ).html.trim()

  it('labels emojis gemoji knows', async () => {
    expect(await render('Pie 🎉 time')).toBe(
      '<p>Pie <span role="img" aria-label="party popper">🎉</span> time</p>'
    )
  })

  it('leaves emojis with no name as text', async () => {
    expect(await render('🇦🇦')).toBe('<p>🇦🇦</p>')
  })

  it('leaves text without emojis alone', async () => {
    expect(await render('Just text')).toBe('<p>Just text</p>')
  })
})

describe('hastUnwrapImages', () => {
  const render = async (md: string) =>
    (await markdownToHtml(md, { hastPlugins: [hastUnwrapImages] })).html.trim()

  it('unwraps paragraphs of only images', async () => {
    expect(await render('![a](a.png)')).toBe('<img src="a.png" alt="a">')
  })

  it('unwraps linked images', async () => {
    expect(await render('[![a](a.png)](https://x.com)')).toBe(
      '<a href="https://x.com"><img src="a.png" alt="a"></a>'
    )
  })

  it('keeps paragraphs with text', async () => {
    expect(await render('See ![a](a.png)')).toBe(
      '<p>See <img src="a.png" alt="a"></p>'
    )
  })
})

describe('mdastStripPrivate', () => {
  it('drops blocks mentioning #private', async () => {
    const { html } = await markdownToHtml(
      'Keep\n\nDrop #private\n\n- a\n- b #private',
      {
        mdastPlugins: [mdastStripPrivate],
      }
    )
    expect(html.trim()).toBe('<p>Keep</p>')
  })
})
