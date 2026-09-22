// Tiny, dependency-free markdown helpers shared by the build (plain-text
// export) and the browser (rendering tailored text). The browser renderer only
// supports inline markdown and escapes all HTML, because tailored text can
// arrive from a shared URL.

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
}

export function decodeEntities(input: string): string {
  return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return ENTITIES[entity.toLowerCase()] ?? match
  })
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Converts (inline) markdown that may contain HTML into plain text. */
export function markdownToPlain(markdown: string): string {
  const text = markdown
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1$2')
    .replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')

  return decodeEntities(text).replace(/\s+/g, ' ').trim()
}

const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i

export function isSafeUrl(url: string): boolean {
  return SAFE_URL.test(url.trim())
}

/**
 * Renders inline markdown (links, bold, italics, code) to HTML. Every other
 * character is escaped, so the output is safe for untrusted input.
 */
export function renderInlineMarkdown(markdown: string): string {
  const codeSpans: string[] = []
  let html = escapeHtml(markdown.replace(/\s+/g, ' ').trim()).replace(
    /`([^`]+)`/g,
    (_, code) => {
      codeSpans.push(`<code>${code}</code>`)
      return `\u0000${codeSpans.length - 1}\u0000`
    }
  )

  html = html
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
      if (!isSafeUrl(decodeEntities(url))) {
        return text
      }
      return `<a href="${url}">${text}</a>`
    })
    .replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
    .replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1<em>$2</em>')

  return html.replace(/\u0000(\d+)\u0000/g, (_, i) => codeSpans[Number(i)])
}

/** Joins items as "a", "a and b" or "a, b, and c". */
export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) {
    return items.join('')
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

export interface SkillKeyword {
  name: string
  url?: string
}

/** HTML for a skills bullet, e.g. "Fluent in <a>TypeScript</a> and <a>Go</a>." */
export function skillLineHtml(lead: string, keywords: SkillKeyword[]): string {
  const links = keywords.map((keyword) => {
    const name = escapeHtml(keyword.name)
    if (!keyword.url || !isSafeUrl(keyword.url)) {
      return `<span itemprop="knowsAbout">${name}</span>`
    }
    return `<a href="${escapeHtml(keyword.url)}" itemprop="knowsAbout" target="_blank">${name}</a>`
  })

  return `${escapeHtml(lead)} ${joinWithAnd(links)}.`
}

/** Plain-text version of a skills bullet. */
export function skillLinePlain(lead: string, keywords: SkillKeyword[]): string {
  return `${lead} ${joinWithAnd(keywords.map((k) => k.name))}.`
}
