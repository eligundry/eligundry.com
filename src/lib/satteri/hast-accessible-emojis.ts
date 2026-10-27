import { defineHastPlugin } from 'satteri'
import emojiRegex from 'emoji-regex'
import { gemoji } from 'gemoji'
import type { Element, ElementContent } from 'hast'

const IGNORE = new Set(['title', 'script', 'style', 'svg', 'math'])

const descriptions = new Map<string, string>()
for (const { emoji, description } of gemoji) {
  descriptions.set(emoji, description)
  descriptions.set(emoji.replace(/️/g, ''), description)
}

const describe = (emoji: string) =>
  descriptions.get(emoji) ?? descriptions.get(emoji.replace(/️/g, ''))

/**
 * Wraps emojis in `<span role="img" aria-label="…">` so screen readers
 * announce their names, like rehype-accessible-emojis did. Emojis gemoji has
 * no name for (newer ones, some ZWJ sequences) are left as plain text, as an
 * unlabeled `role="img"` would be an image with no name.
 */
const hastAccessibleEmojis = defineHastPlugin({
  name: 'accessible-emojis',
  text(node, ctx) {
    const parent = ctx.parent(node) as Element | undefined
    if (parent?.type === 'element' && IGNORE.has(parent.tagName)) return

    const children: ElementContent[] = []
    let last = 0
    let labeled = false

    for (const match of node.value.matchAll(emojiRegex())) {
      const description = describe(match[0])
      if (!description) continue

      if (match.index > last) {
        children.push({
          type: 'text',
          value: node.value.slice(last, match.index),
        })
      }
      children.push({
        type: 'element',
        tagName: 'span',
        properties: { role: 'img', ariaLabel: description },
        children: [{ type: 'text', value: match[0] }],
      })
      last = match.index + match[0].length
      labeled = true
    }

    if (!labeled) return
    if (last < node.value.length) {
      children.push({ type: 'text', value: node.value.slice(last) })
    }
    ctx.replaceNode(node, children)
  },
})

export default hastAccessibleEmojis
