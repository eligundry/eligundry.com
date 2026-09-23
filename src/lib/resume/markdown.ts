import { micromark } from 'micromark'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'

/**
 * Renders markdown to HTML. Trusted (build-time) content may contain inline
 * HTML. Untrusted content, such as tailoring text from a shared link, has its
 * HTML escaped and unsafe link protocols (e.g. `javascript:`) removed.
 *
 * A single paragraph is unwrapped so it can sit inside an `<li>` or `<span>`.
 */
export function renderMarkdown(
  markdown: string,
  { trusted }: { trusted: boolean }
): string {
  const html = micromark(markdown, { allowDangerousHtml: trusted }).trim()
  const inner = html.slice('<p>'.length, -'</p>'.length)
  const isSingleParagraph =
    html.startsWith('<p>') && html.endsWith('</p>') && !inner.includes('<p>')
  return isSingleParagraph ? inner : html
}

/** The text of some markdown, without formatting, links or inline HTML. */
export function markdownToPlain(markdown: string): string {
  return toString(fromMarkdown(markdown), { includeHtml: false })
    .split(/\s+/)
    .filter(Boolean)
    .join(' ')
}

/** Joins items as "a", "a and b" or "a, b, and c". */
export function joinWithAnd(items: string[]): string {
  if (items.length <= 2) {
    return items.join(' and ')
  }
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}
