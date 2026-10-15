import Validator from '@adobe/structured-data-validator'
import type { Page } from '@playwright/test'

/**
 * Validates a page's schema.org microdata with Adobe's structured data
 * validator (@adobe/structured-data-validator), made stricter:
 *
 * - Adobe checks that types exist, that properties apply to their type
 *   (reported as warnings, which fail here too) and Google's rich result
 *   requirements for the types it knows.
 * - It doesn't check values yet (a TODO in its schema.org handler), so
 *   `ValueRanges` is added as another of its handlers: each value must fit
 *   its property's range, superseded terms are reported, and a link's `href`
 *   can't be the value of a Text-only property like `email` or `award`.
 * - Microdata is read from the rendered page by `extractMicrodata()` rather
 *   than @marbec/web-auto-extractor, which ignores `<time datetime>` and
 *   `<link href>` values and can't tell links from text.
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
  /** For an enumeration member such as EventScheduled, its enumerations. */
  memberOf: string[]
  ranges: string[]
  supersededBy?: string
}

type Kind = MicrodataValue['kind']
type Json = Record<string, unknown>
type Vocabulary = { '@graph': Json[] }

const ids = (value: unknown): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).map((v) =>
    String((v as { '@id': string })['@id']).replace(/^schema:/, '')
  )

const typeName = (itemtype: string) =>
  itemtype.replace(/^https?:\/\/schema\.org\//, '')

/** How each item's values were given, which Adobe's data format loses. */
const kinds = new WeakMap<Json, Record<string, Kind[]>>()

/**
 * Converts items to the format Adobe's validator takes (that of
 * @marbec/web-auto-extractor): one value or an array of them per property.
 */
function toValidatorData(items: MicrodataItem[]) {
  const convert = (item: MicrodataItem): Json => {
    const data: Json = { '@type': item.types.map(typeName) }
    if (item.types.length === 1) data['@type'] = typeName(item.types[0])
    if (item.id) data['@id'] = item.id
    const itemKinds: Record<string, Kind[]> = {}
    for (const [name, values] of Object.entries(item.properties)) {
      const converted = values.map((value) =>
        value.kind === 'item' ? convert(value.item) : value.value
      )
      data[name] = converted.length === 1 ? converted[0] : converted
      itemKinds[name] = values.map((value) => value.kind)
    }
    kinds.set(data, itemKinds)
    return data
  }
  const microdata: Record<string, Json[]> = {}
  for (const item of items) {
    const data = convert(item)
    const [type] = ([] as unknown[]).concat(data['@type'])
    ;(microdata[String(type ?? 'untyped')] ??= []).push(data)
  }
  return { microdata }
}

/** Problems with a page's microdata, as "path: message". */
export async function validateMicrodata(
  items: MicrodataItem[],
  vocabulary: Vocabulary
): Promise<string[]> {
  const problems: string[] = []
  // Adobe skips items without a type, so they're reported here
  const untyped = (item: MicrodataItem, path: string) => {
    if (!item.types.length) problems.push(`${path}: has no itemtype`)
    for (const [name, values] of Object.entries(item.properties)) {
      values.forEach((value, i) => {
        if (value.kind === 'item') untyped(value.item, `${path}.${name}[${i}]`)
      })
    }
  }
  items.forEach((item, i) => untyped(item, `item[${i}]`))

  const validator = new Validator(vocabulary)
  validator.globalHandlers.push(async () => ({ default: ValueRanges }))
  for (const issue of await validator.validate(toValidatorData(items))) {
    const path = (issue.path ?? [])
      .map((part) =>
        [
          part.property,
          part.type && `<${part.type}>`,
          (part.length ?? 0) > 1 && `[${part.index}]`,
        ]
          .filter(Boolean)
          .join('')
      )
      .join('.')
    problems.push(`${path}: ${issue.issueMessage}`)
  }
  return problems
}

export async function loadVocabulary(
  url = VOCABULARY_URL
): Promise<Vocabulary> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Fetching ${url} failed: ${response.status}`)
  }
  return response.json()
}

/** The schema.org terms, indexed once per vocabulary. */
const termsCache = new WeakMap<Vocabulary, Map<string, Term>>()

function termsOf(vocabulary: Vocabulary) {
  let terms = termsCache.get(vocabulary)
  if (terms) return terms
  terms = new Map()
  for (const node of vocabulary['@graph']) {
    const id = String(node['@id'])
    if (!id.startsWith('schema:')) continue
    const types = ([] as unknown[]).concat(node['@type'])
    terms.set(id.replace(/^schema:/, ''), {
      id: id.replace(/^schema:/, ''),
      isClass: types.includes('rdfs:Class'),
      isDataType: types.includes('schema:DataType'),
      parents: ids(node['rdfs:subClassOf']),
      memberOf: ids(
        types
          .filter((t) => String(t).startsWith('schema:'))
          .map((t) => ({ '@id': t }))
      ),
      ranges: ids(node['schema:rangeIncludes']),
      supersededBy: ids(node['schema:supersededBy'])[0],
    })
  }
  termsCache.set(vocabulary, terms)
  return terms
}

interface Issue {
  issueMessage: string
  severity: 'ERROR' | 'WARNING'
  path: unknown[]
  fieldNames: string[]
}

/**
 * An extra handler for Adobe's validator, run on every typed item: checks
 * each value against its property's range.
 */
class ValueRanges {
  private terms: Map<string, Term>
  private path: unknown[]
  private type: string

  constructor({
    path,
    type,
    schemaOrgJson,
  }: {
    path: unknown[]
    type: string
    schemaOrgJson: Vocabulary
  }) {
    this.terms = termsOf(schemaOrgJson)
    this.path = path
    this.type = typeName(type)
  }

  validate(data: Json): Issue[] {
    const issues: Issue[] = []
    const issue = (property: string, message: string) =>
      issues.push({
        issueMessage: message,
        severity: 'ERROR',
        path: this.path,
        fieldNames: [property],
      })

    const type = this.terms.get(this.type)
    if (type?.supersededBy) {
      issue('@type', `Type "${type.id}" is superseded by ${type.supersededBy}`)
    }
    const itemKinds = kinds.get(data) ?? {}
    for (const [name, raw] of Object.entries(data)) {
      if (name.startsWith('@')) continue
      const property = this.terms.get(name)
      if (!property || property.isClass) continue // Adobe reports these
      if (property.supersededBy) {
        issue(
          name,
          `Property "${name}" is superseded by ${property.supersededBy}`
        )
      }
      const values = ([] as unknown[]).concat(raw)
      values.forEach((value, i) => {
        const problem = this.checkValue(property, value, itemKinds[name]?.[i])
        if (problem) issue(name, `Property "${name}": ${problem}`)
      })
    }
    return issues
  }

  /** `type` and every class it is a subclass of. */
  private ancestors(type: string): Set<string> {
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
    return [...this.ancestors(id)].some((a) => this.terms.get(a)?.isDataType)
  }

  /** What's wrong with a value, if anything. */
  private checkValue(
    property: Term,
    value: unknown,
    kind: Kind = typeof value === 'object' ? 'item' : 'text'
  ): string | undefined {
    const ranges = property.ranges
    const expects = `expects ${ranges.join(', ')}`
    const rangeHas = (type: string) =>
      ranges.some((range) => this.ancestors(type).has(range))
    const classRanges = ranges.filter((r) => !this.isDataType(r))

    if (kind === 'item') {
      const types = ([] as unknown[])
        .concat((value as Json)['@type'])
        .map(String)
      // Role subclasses may stand in for any value (schema.org's Role pattern)
      const fits = types.some(
        (t) => rangeHas(t) || this.ancestors(t).has('Role')
      )
      return fits ? undefined : `${types.join(' ')} given, ${expects}`
    }

    const text = String(value)
    // An enumeration member, such as https://schema.org/EventScheduled
    const name = text.match(/^https?:\/\/schema\.org\/(\w+)$/)?.[1]
    const member = name ? this.terms.get(name) : undefined
    if (member && !member.isClass && member.memberOf.length) {
      return member.memberOf.some(rangeHas)
        ? undefined
        : `${name} given, ${expects}`
    }

    if (kind === 'url') {
      // A URL can name a thing as well as be one
      return ranges.includes('URL') || classRanges.length
        ? undefined
        : `URL ${text} given, ${expects}`
    }

    if (!text) return 'is empty'
    const fitsRange = (range: string) => {
      const ancestors = this.ancestors(range)
      if (range === 'URL') return /^[a-z][a-z\d+.-]*:/i.test(text)
      if (range === 'Duration') {
        return /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+(\.\d+)?S)?)?$/.test(
          text
        )
      }
      if (ancestors.has('DateTime'))
        return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text)
      if (ancestors.has('Date'))
        return /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(text)
      if (ancestors.has('Time')) return /^\d{2}:\d{2}/.test(text)
      if (ancestors.has('Number')) return !Number.isNaN(Number(text))
      if (ancestors.has('Boolean')) return /^(?:True|False)$/i.test(text)
      return ancestors.has('Text')
    }
    return ranges.some(fitsRange) ? undefined : `"${text}" given, ${expects}`
  }
}
