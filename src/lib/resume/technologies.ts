import type { Link, Nodes } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'
import type { Element, ElementContent, Properties, Root } from 'hast'
import { SKIP, visit } from 'unist-util-visit'
import { KNOWS_ABOUT } from './microdata'

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

const h = (
  tagName: string,
  properties: Properties,
  children: ElementContent[] = []
): Element => ({ type: 'element', tagName, properties, children })

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

/**
 * Marks links in a hast tree that point at a technology as a schema.org
 * `Thing` the page's Person `knowsAbout`, named by the link's text:
 *
 * ```html
 * <a href="…" itemprop="knowsAbout" itemscope itemtype="https://schema.org/Thing">
 *   <link itemprop="url" href="…"><span itemprop="name">React</span>
 * </a>
 * ```
 */
export function markTechnologyLinks(
  tree: Root,
  technologies: Technology[]
): void {
  if (!technologies.length) return
  const keys = new Set(technologies.map((t) => technologyKey(t.url)))
  visit(tree, 'element', (link) => {
    const { href, itemProp, itemScope } = link.properties
    if (link.tagName !== 'a' || typeof href !== 'string') return
    if (itemProp || itemScope || !keys.has(technologyKey(href))) return
    Object.assign(link.properties, {
      itemProp: [KNOWS_ABOUT.itemProp],
      itemScope: KNOWS_ABOUT.itemScope,
      itemType: [KNOWS_ABOUT.itemType],
    })
    link.children = [
      h('link', { itemProp: ['url'], href }),
      h('span', { itemProp: ['name'] }, link.children),
    ]
    return SKIP
  })
}
