import { defineHastPlugin } from 'satteri'
import type { Element, ElementContent } from 'hast'

type Contents = 'unknown' | 'image' | 'other'

const isWhitespace = (node: ElementContent) =>
  node.type === 'text' && node.value.trim() === ''

// What rehype-unwrap-images treats as an image wrapper: a paragraph holding
// only images, optionally inside a link, and whitespace
function contents(node: Element, inLink: boolean): Contents {
  let found: Contents = 'unknown'

  for (const child of node.children) {
    if (isWhitespace(child)) continue
    if (child.type === 'element' && child.tagName === 'img') {
      found = 'image'
    } else if (!inLink && child.type === 'element' && child.tagName === 'a') {
      const inner = contents(child, true)
      if (inner === 'other') return 'other'
      if (inner === 'image') found = 'image'
    } else {
      return 'other'
    }
  }

  return found
}

/**
 * Removes the `<p>` Markdown puts around a paragraph that is only images, the
 * Sätteri port of rehype-unwrap-images.
 */
const hastUnwrapImages = defineHastPlugin({
  name: 'unwrap-images',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      if (contents(node, false) === 'image') {
        ctx.replaceNode(node, node.children)
      }
    },
  },
})

export default hastUnwrapImages
