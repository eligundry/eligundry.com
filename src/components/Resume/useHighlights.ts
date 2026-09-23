import escapeRegExp from 'lodash/escapeRegExp'
import { useEffect } from 'preact/hooks'

const NAME = 'tailor'

/**
 * Highlights terms in the resume with the CSS Custom Highlight API, which
 * styles text ranges without touching the DOM Preact renders.
 */
export function useHighlights(terms: string[], deps: unknown[]) {
  useEffect(() => {
    const root = document.querySelector('[data-resume-root]')
    const words = terms.map((term) => term.trim()).filter(Boolean)
    if (!root || !words.length || typeof Highlight === 'undefined') return

    const pattern = new RegExp(
      `\\b(${words.map(escapeRegExp).join('|')})(?!\\w)`,
      'gi'
    )
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest('del, header')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    })

    const ranges: Range[] = []
    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      for (const match of node.data.matchAll(pattern)) {
        const range = new Range()
        range.setStart(node, match.index)
        range.setEnd(node, match.index + match[0].length)
        ranges.push(range)
      }
    }

    CSS.highlights.set(NAME, new Highlight(...ranges))
    return () => CSS.highlights.delete(NAME)
  }, [terms, ...deps])
}
