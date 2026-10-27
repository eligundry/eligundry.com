import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import Code from './Code.astro'

describe('Code', () => {
  it('puts nothing between <pre> and the code', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Code, {
      props: { class: 'shiki' },
      slots: { default: '<code>x</code>' },
    })
    expect(html).toBe(
      '<pre class="astro-code astro-code-compact shiki" tabindex="0"><code>x</code></pre>'
    )
  })

  it('leaves the class off when there is none', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Code, {
      slots: { default: '<code>x</code>' },
    })
    expect(html).toBe('<pre tabindex="0"><code>x</code></pre>')
  })
})
