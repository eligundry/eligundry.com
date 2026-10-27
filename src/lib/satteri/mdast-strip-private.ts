import { defineMdastPlugin } from 'satteri'

/**
 * Drops every top-level block whose text mentions `#private`.
 */
const mdastStripPrivate = defineMdastPlugin({
  name: 'strip-private',
  before(root, ctx) {
    for (const child of root.children) {
      if (ctx.textContent(child).includes('#private')) {
        ctx.removeNode(child)
      }
    }
  },
})

export default mdastStripPrivate
