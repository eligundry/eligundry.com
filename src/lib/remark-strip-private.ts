import type { Plugin } from 'unified'
import type { Root, RootContent } from 'mdast'
import { visit, SKIP } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'

const remarkStripPrivate: Plugin<[], Root> = () => (tree) => {
  visit(tree, (_node, index, parent) => {
    if (index === undefined || !parent) return
    const node = _node as RootContent
    if (toString(node).includes('#private')) {
      parent.children.splice(index, 1)
      return [SKIP, index]
    }
  })
}

export default remarkStripPrivate
