import type { Root as MdastRoot } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'
import { toString } from 'mdast-util-to-string'
import { toHtml } from 'hast-util-to-html'
import type { Element, Root as HastRoot } from 'hast'
import { sanitizeUri } from 'micromark-util-sanitize-uri'
import { visit } from 'unist-util-visit'
import { markTechnologyLinks, type Technology } from './technologies'

// Link and image protocols allowed in rendered markdown, as in micromark
const SAFE_HREF = /^(https?|ircs?|mailto|xmpp)$/i
const SAFE_SRC = /^https?$/i

export interface RenderedMarkdown {
  html: string
  /** The text without formatting, for microdata such as a `description`. */
  text: string
}

/**
 * Renders markdown to HTML. Trusted (build-time) content may contain inline
 * HTML. Untrusted content, such as tailoring text from a shared link, has its
 * HTML escaped. Unsafe link protocols (e.g. `javascript:`) are removed.
 *
 * A single paragraph is unwrapped so it can sit inside an `<li>` or `<span>`.
 * Markdown links to known technologies are marked up as schema.org `Thing`s
 * the Person `knowsAbout`, so tailored text carries the same microdata. Inline
 * HTML links in the content, such as to clients, are left as they are.
 */
export function renderMarkdown(
  markdown: string,
  {
    trusted,
    technologies = [],
  }: { trusted: boolean; technologies?: Technology[] }
): RenderedMarkdown {
  const mdast = fromMarkdown(markdown)
  visit(mdast, (node) => {
    if (node.type === 'html' && !trusted) {
      // Shown as text, so it's escaped when rendered
      Object.assign(node, { type: 'text' })
    } else if (node.type === 'link' || node.type === 'definition') {
      node.url = sanitizeUri(node.url, SAFE_HREF)
    } else if (node.type === 'image') {
      node.url = sanitizeUri(node.url, SAFE_SRC)
    }
  })

  const hast = toHast(mdast, { allowDangerousHtml: trusted }) as HastRoot
  markTechnologyLinks(hast, technologies)

  const blocks = hast.children.filter(
    (child) => child.type !== 'text' || child.value.trim()
  )
  const [only] = blocks
  if (blocks.length === 1 && only.type === 'element' && only.tagName === 'p') {
    hast.children = (only as Element).children
  }

  return {
    html: toHtml(hast, {
      allowDangerousHtml: trusted,
      characterReferences: { useNamedReferences: true },
    }).trim(),
    text: plainText(mdast),
  }
}

const plainText = (mdast: MdastRoot) =>
  toString(mdast, { includeHtml: false }).split(/\s+/).filter(Boolean).join(' ')

/**
 * Rewrites the inline HTML used in the resume's content as markdown, so it can
 * be edited by hand: links become markdown links and other tags (such as
 * `<abbr>`) are reduced to their text. Edits are rendered as untrusted
 * markdown, where inline HTML would be escaped.
 */
export function inlineHtmlToMarkdown(markdown: string): string {
  return markdown
    .replace(
      /<a\b[^>]*?\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi,
      (_, _quote, href: string, text: string) => `[${text}](${href})`
    )
    .replace(/<\/?(?:abbr|span|em|strong|b|i)\b[^>]*>/gi, '')
}

/** The text of some markdown, without formatting, links or inline HTML. */
export function markdownToPlain(markdown: string): string {
  return plainText(fromMarkdown(markdown))
}

/** Joins items as "a", "a and b" or "a, b, and c". */
export function joinWithAnd(items: string[]): string {
  if (items.length <= 2) {
    return items.join(' and ')
  }
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}
