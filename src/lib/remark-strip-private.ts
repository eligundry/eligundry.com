import { visit, SKIP } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'

const remarkStripPrivate = () => (tree: Parameters<typeof visit>[0]) => {
  visit(tree, (_node, index, parent: { children: unknown[] } | undefined) => {
    if (index === undefined || !parent) return
    if (toString(_node).includes('#private')) {
      parent.children.splice(index, 1)
      return [SKIP, index]
    }
  })
}

export default remarkStripPrivate
