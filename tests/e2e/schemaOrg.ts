import type { Page } from '@playwright/test'

/**
 * Checks a page's schema.org microdata against the schema.org vocabulary, the
 * way validator.schema.org does, plus what it only hints at: every type and
 * property exists, each property applies to its item's type, and each value
 * fits the property's range. A link's `href` is a URL, so it can't be the value
 * of a Text-only property like `email` or `award`.
 */

/** Includes pending terms such as `Credential`, like validator.schema.org. */
export const VOCABULARY_URL =
  'https://schema.org/version/latest/schemaorg-all-https.jsonld'

export type MicrodataValue =
  | { kind: 'item'; item: MicrodataItem }
  /** From an attribute that holds a URL, such as `<a href>` or `<link href>`. */
  | { kind: 'url'; value: string }
  | { kind: 'text'; value: string }

export interface MicrodataItem {
  types: string[]
  id?: string
  properties: Record<string, MicrodataValue[]>
}

/** The page's top-level microdata items, following the HTML microdata model. */
export function extractMicrodata(page: Page): Promise<MicrodataItem[]> {
  return page.evaluate(() => {
    const URL_ATTRIBUTES: Record<string, string> = {
      a: 'href',
      area: 'href',
      link: 'href',
      audio: 'src',
      embed: 'src',
      iframe: 'src',
      img: 'src',
      source: 'src',
      track: 'src',
      video: 'src',
      object: 'data',
    }

    const valueOf = (element: Element): MicrodataValue => {
      if (element.hasAttribute('itemscope')) {
        return { kind: 'item', item: itemOf(element) }
      }
      const tag = element.localName
      const urlAttribute = URL_ATTRIBUTES[tag]
      if (urlAttribute) {
        const raw = element.getAttribute(urlAttribute) ?? ''
        return { kind: 'url', value: new URL(raw, document.baseURI).href }
      }
      if (tag === 'meta') {
        return { kind: 'text', value: element.getAttribute('content') ?? '' }
      }
      if (tag === 'data' || tag === 'meter') {
        return { kind: 'text', value: element.getAttribute('value') ?? '' }
      }
      if (tag === 'time' && element.hasAttribute('datetime')) {
        return { kind: 'text', value: element.getAttribute('datetime')! }
      }
      return { kind: 'text', value: element.textContent?.trim() ?? '' }
    }

    function itemOf(root: Element): MicrodataItem {
      const item: MicrodataItem = {
        types: (root.getAttribute('itemtype') ?? '')
          .split(/\s+/)
          .filter(Boolean),
        id: root.getAttribute('itemid') ?? undefined,
        properties: {},
      }
      const crawl = (element: Element) => {
        for (const child of Array.from(element.children)) {
          const names = (child.getAttribute('itemprop') ?? '')
            .split(/\s+/)
            .filter(Boolean)
          if (names.length) {
            const value = valueOf(child)
            for (const name of names) {
              ;(item.properties[name] ??= []).push(value)
            }
          }
          // A nested item's own properties belong to it, not this item
          if (!child.hasAttribute('itemscope')) crawl(child)
        }
      }
      crawl(root)
      return item
    }

    return Array.from(document.querySelectorAll('[itemscope]'))
      .filter((element) => !element.hasAttribute('itemprop'))
      .map(itemOf)
  })
}

interface Term {
  id: string
  isClass: boolean
  isDataType: boolean
  parents: string[]
  domains: string[]
  ranges: string[]
  supersededBy?: string
}

const ids = (value: unknown): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).map((v) =>
    String((v as { '@id': string })['@id']).replace(/^schema:/, '')
  )

export class Vocabulary {
  private terms = new Map<string, Term>()

  constructor(jsonld: { '@graph': Record<string, unknown>[] }) {
    for (const node of jsonld['@graph']) {
      const id = String(node['@id'])
      if (!id.startsWith('schema:')) continue
      const types = ([] as unknown[]).concat(node['@type'])
      this.terms.set(id.replace(/^schema:/, ''), {
        id: id.replace(/^schema:/, ''),
        isClass: types.includes('rdfs:Class'),
        isDataType: types.includes('schema:DataType'),
        parents: ids(node['rdfs:subClassOf']),
        domains: ids(node['schema:domainIncludes']),
        ranges: ids(node['schema:rangeIncludes']),
        supersededBy: ids(node['schema:supersededBy'])[0],
      })
    }
  }

  static async load(url = VOCABULARY_URL): Promise<Vocabulary> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Fetching ${url} failed: ${response.status}`)
    }
    return new Vocabulary(await response.json())
  }

  /** `type` and every class it is a subclass of. */
  ancestors(type: string): Set<string> {
    const seen = new Set<string>()
    const visit = (id: string) => {
      if (seen.has(id)) return
      seen.add(id)
      this.terms.get(id)?.parents.forEach(visit)
    }
    visit(type)
    return seen
  }

  private isDataType(id: string) {
    const ancestors = this.ancestors(id)
    return [...ancestors].some((a) => this.terms.get(a)?.isDataType)
  }

  /** Problems with the items, each with a path to where it is. */
  check(items: MicrodataItem[]): string[] {
    const problems: string[] = []
    items.forEach((item, i) => this.checkItem(item, `item[${i}]`, problems))
    return problems
  }

  private checkItem(item: MicrodataItem, path: string, problems: string[]) {
    if (!item.types.length) {
      problems.push(`${path}: has no itemtype`)
      return
    }
    const types: string[] = []
    for (const itemtype of item.types) {
      const match = itemtype.match(/^https?:\/\/schema\.org\/(\w+)$/)
      const term = match && this.terms.get(match[1])
      if (!term?.isClass || this.isDataType(term.id)) {
        problems.push(`${path}: ${itemtype} is not a schema.org type`)
        continue
      }
      if (term.supersededBy) {
        problems.push(
          `${path}: ${term.id} is superseded by ${term.supersededBy}`
        )
      }
      types.push(term.id)
    }
    if (!types.length) return
    path = `${path}<${types.join(' ')}>`
    const ancestors = new Set(types.flatMap((t) => [...this.ancestors(t)]))

    for (const [name, values] of Object.entries(item.properties)) {
      const property = this.terms.get(name)
      if (!property || property.isClass) {
        problems.push(`${path}.${name}: not a schema.org property`)
        continue
      }
      if (property.supersededBy) {
        problems.push(`${path}.${name}: superseded by ${property.supersededBy}`)
      }
      if (!property.domains.some((d) => ancestors.has(d))) {
        problems.push(
          `${path}.${name}: not a property of ${types.join(' or ')} (expects ${property.domains.join(', ')})`
        )
      }
      values.forEach((value, i) =>
        this.checkValue(property, value, `${path}.${name}[${i}]`, problems)
      )
    }
  }

  private checkValue(
    property: Term,
    value: MicrodataValue,
    path: string,
    problems: string[]
  ) {
    const ranges = property.ranges
    const expects = `expects ${ranges.join(', ')}`
    const rangeHas = (type: string) =>
      ranges.some((range) => this.ancestors(type).has(range))
    const classRanges = ranges.filter((r) => !this.isDataType(r))

    if (value.kind === 'item') {
      this.checkItem(value.item, path, problems)
      const types = value.item.types.map((t) =>
        t.replace(/^https?:\/\/schema\.org\//, '')
      )
      // Role subclasses may stand in for any value (schema.org's Role pattern)
      const fits = types.some(
        (t) => rangeHas(t) || this.ancestors(t).has('Role')
      )
      if (!fits) problems.push(`${path}: ${types.join(' ')} given, ${expects}`)
      return
    }

    if (value.kind === 'url') {
      // A URL can name a thing as well as be one
      if (!ranges.includes('URL') && !classRanges.length) {
        problems.push(`${path}: URL ${value.value} given, ${expects}`)
      }
      return
    }

    const text = value.value
    if (!text) {
      problems.push(`${path}: is empty`)
      return
    }
    const fitsRange = (range: string) => {
      const ancestors = this.ancestors(range)
      if (range === 'URL') return /^[a-z][a-z\d+.-]*:/i.test(text)
      if (ancestors.has('DateTime'))
        return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text)
      if (ancestors.has('Date'))
        return /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(text)
      if (ancestors.has('Time')) return /^\d{2}:\d{2}/.test(text)
      if (ancestors.has('Number')) return !Number.isNaN(Number(text))
      if (ancestors.has('Boolean')) return /^(?:True|False)$/i.test(text)
      return ancestors.has('Text')
    }
    const ok = ranges.some(fitsRange)
    if (!ok) problems.push(`${path}: "${text}" given, ${expects}`)
  }
}
