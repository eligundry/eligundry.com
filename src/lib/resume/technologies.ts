import type { Link, Nodes } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'

// Technologies are the things the resume links to as skills: every keyword in
// resumeSkills.yaml plus every markdown link in a job's bullets that doesn't
// point at the employer's own site. Agents get the list so they reuse the same
// URLs, and links to these URLs are marked up as schema.org `Thing`s the page's
// Person `knowsAbout`.

export interface Technology {
  name: string
  url: string
}

/** A URL reduced to host and path, so `https://www.x.com/` matches `http://x.com`. */
export function technologyKey(url: string): string | undefined {
  try {
    const { hostname, pathname } = new URL(url)
    return (
      hostname.replace(/^www\./, '') + pathname.replace(/\/+$/, '')
    ).toLowerCase()
  } catch {
    return undefined
  }
}

const hostOf = (url: string) => technologyKey(url)?.split('/')[0]

function collectLinks(node: Nodes, links: Link[] = []): Link[] {
  if (node.type === 'link') links.push(node)
  if ('children' in node) {
    for (const child of node.children) collectLinks(child, links)
  }
  return links
}

/** The markdown links in some markdown, as technologies. */
export function markdownLinks(markdown: string): Technology[] {
  return collectLinks(fromMarkdown(markdown)).map((link) => ({
    name: toString(link),
    url: link.url,
  }))
}

export function collectTechnologies({
  skills,
  experiences,
}: {
  skills: { keywords: { name: string; url?: string }[] }[]
  experiences: {
    url: string
    summary?: { markdown: string }
    highlights: { markdown: string }[]
  }[]
}): Technology[] {
  const byKey = new Map<string, Technology>()
  const add = (technology: Technology) => {
    const key = technologyKey(technology.url)
    if (key && technology.name && !byKey.has(key)) byKey.set(key, technology)
  }

  for (const skill of skills) {
    for (const { name, url } of skill.keywords) {
      if (url) add({ name, url })
    }
  }

  for (const experience of experiences) {
    const employer = hostOf(experience.url)
    const texts = [experience.summary, ...experience.highlights]
    for (const text of texts) {
      if (!text) continue
      for (const link of markdownLinks(text.markdown)) {
        const host = hostOf(link.url)
        const ownSite =
          employer &&
          host &&
          (host === employer || host.endsWith(`.${employer}`))
        if (!ownSite) add(link)
      }
    }
  }

  return [...byKey.values()]
}

/** Microdata attributes for an element that is a technology the Person knows. */
export const KNOWS_ABOUT_ATTRIBUTES =
  'itemprop="knowsAbout" itemscope itemtype="https://schema.org/Thing"'

const decodeHref = (href: string) => href.replace(/&amp;/g, '&')

/**
 * Marks links in `html` that point at a technology as a schema.org `Thing` the
 * page's Person `knowsAbout`, named by the link's text:
 *
 * ```html
 * <a href="…" itemprop="knowsAbout" itemscope itemtype="https://schema.org/Thing">
 *   <link itemprop="url" href="…"><span itemprop="name">React</span>
 * </a>
 * ```
 */
export function markTechnologyLinks(
  html: string,
  technologies: Technology[]
): string {
  if (!technologies.length) return html
  const keys = new Set(technologies.map((t) => technologyKey(t.url)))
  return html.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (link, attributes: string, text: string) => {
      const href = attributes.match(/\bhref\s*=\s*"([^"]*)"/i)?.[1]
      if (!href || /\bitem(?:prop|scope)\b/i.test(attributes)) return link
      return keys.has(technologyKey(decodeHref(href)))
        ? `<a${attributes} ${KNOWS_ABOUT_ATTRIBUTES}>` +
            `<link itemprop="url" href="${href}">` +
            `<span itemprop="name">${text}</span></a>`
        : link
    }
  )
}
