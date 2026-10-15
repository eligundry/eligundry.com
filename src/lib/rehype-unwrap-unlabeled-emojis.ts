import { visit, SKIP } from 'unist-util-visit'

type Element = {
  type: 'element'
  tagName: string
  properties?: Record<string, unknown>
  children: unknown[]
}

/**
 * rehype-accessible-emojis wraps emojis it has no name for (newer ones like 🦷,
 * ZWJ sequences like 🏋️‍♂️) in `<span role="img" aria-label="" aria-hidden="">`.
 * An empty aria-hidden hides nothing, so that's an image with no name. Unwrap
 * those spans so screen readers announce the emoji themselves.
 */
const rehypeUnwrapUnlabeledEmojis =
  () => (tree: Parameters<typeof visit>[0]) => {
    visit(
      tree,
      'element',
      (node: Element, index, parent: { children: unknown[] } | undefined) => {
        if (index === undefined || !parent) return
        if (
          node.tagName === 'span' &&
          node.properties?.role === 'img' &&
          !node.properties.ariaLabel
        ) {
          parent.children.splice(index, 1, ...node.children)
          return [SKIP, index]
        }
      }
    )
  }

export default rehypeUnwrapUnlabeledEmojis
