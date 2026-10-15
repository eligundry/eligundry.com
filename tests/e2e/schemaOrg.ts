import Validator from '@adobe/structured-data-validator'
import WebAutoExtractor from '@marbec/web-auto-extractor'
import type { Page } from '@playwright/test'

/**
 * Validates a page's schema.org microdata with Adobe's structured data
 * validator (@adobe/structured-data-validator), made stricter:
 *
 * - The rendered page is read with @marbec/web-auto-extractor, the extractor
 *   Adobe's validator is built for.
 * - Adobe checks that types exist, that properties apply to their type
 *   (reported as warnings, which fail here too) and Google's rich result
 *   requirements for the types it knows.
 * - It doesn't check values yet (a TODO in its schema.org handler), so
 *   `ValueRanges` is added as another of its handlers: each value must fit
 *   its property's range, and superseded terms are reported.
 * - The extractor gives a link's `href` as plain text, so links are checked
 *   on the page itself: one can't be the value of a Text-only property like
 *   `email` or `award` (`linkProblems()`).
 *
 * The extractor reads an element's text rather than `<time datetime>`, so
 * dates are given in `<meta>` tags.
 */

/** Includes pending terms such as `Credential`, like validator.schema.org. */
export const VOCABULARY_URL =
  'https://schema.org/version/latest/schemaorg-all-https.jsonld'

export type Json = Record<string, unknown>
type Vocabulary = { '@graph': Json[] }

/** The page's microdata, by top-level type, as web-auto-extractor reads it. */
export async function extractMicrodata(
  page: Page
): Promise<Record<string, Json[]>> {
  // The extractor gives URLs as written, so resolve relative ones first
  const html = await page.evaluate(() => {
    const root = document.documentElement.cloneNode(true) as HTMLElement
    for (const element of root.querySelectorAll<HTMLElement>(
      '[itemprop][href], [itemprop][src], [itemprop][data]'
    )) {
      for (const name of ['href', 'src', 'data']) {
        const value = element.getAttribute(name)
        if (value !== null) {
          element.setAttribute(name, new URL(value, document.baseURI).href)
        }
      }
    }
    return root.outerHTML
  })
  const { microdata } = new WebAutoExtractor({ embedSource: false }).parse(html)
  return microdata
}

/** Problems with a page's microdata, as "path: message". */
export async function validateMicrodata(
  page: Page,
  vocabulary: Vocabulary
): Promise<string[]> {
  const problems = await linkProblems(page, vocabulary)
  const validator = new Validator(vocabulary)
  validator.globalHandlers.push(async () => ({ default: ValueRanges }))
  const microdata = await extractMicrodata(page)
  for (const issue of await validator.validate({ microdata })) {
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

/** Links whose `href` is the value of a property that can't be a URL. */
async function linkProblems(page: Page, vocabulary: Vocabulary) {
  const links = await page.$$eval(
    'a[itemprop]:not([itemscope]), link[itemprop]:not([itemscope]), area[itemprop]:not([itemscope])',
    (elements) =>
      elements.map((element) => ({
        properties: element.getAttribute('itemprop')!.split(/\s+/),
        href: (element as HTMLAnchorElement).href,
      }))
  )
  const terms = termsOf(vocabulary)
  const urlFits = (range: string) =>
    range === 'URL' || !isDataType(terms, range)
  return links.flatMap(({ properties, href }) =>
    properties
      .filter((name) => {
        const ranges = terms.get(name)?.ranges ?? []
        return ranges.length && !ranges.some(urlFits)
      })
      .map(
        (name) =>
          `${name}: link ${href} given, expects ${terms.get(name)!.ranges.join(', ')}`
      )
  )
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

const ids = (value: unknown): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).map((v) =>
    String((v as { '@id': string })['@id']).replace(/^schema:/, '')
  )

const typeName = (itemtype: string) =>
  itemtype.replace(/^https?:\/\/schema\.org\//, '')

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

/** `type` and every class it is a subclass of. */
function ancestors(terms: Map<string, Term>, type: string): Set<string> {
  const seen = new Set<string>()
  const visit = (id: string) => {
    if (seen.has(id)) return
    seen.add(id)
    terms.get(id)?.parents.forEach(visit)
  }
  visit(type)
  return seen
}

const isDataType = (terms: Map<string, Term>, id: string) =>
  [...ancestors(terms, id)].some((a) => terms.get(a)?.isDataType)

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
      values.forEach((value) => {
        const problem = this.checkValue(property, value)
        if (problem) issue(name, `Property "${name}": ${problem}`)
      })
    }
    return issues
  }

  private ancestors(type: string) {
    return ancestors(this.terms, type)
  }

  private isDataType(id: string) {
    return isDataType(this.terms, id)
  }

  /** What's wrong with a value, if anything. */
  private checkValue(property: Term, value: unknown): string | undefined {
    const ranges = property.ranges
    const expects = `expects ${ranges.join(', ')}`
    const rangeHas = (type: string) =>
      ranges.some((range) => this.ancestors(type).has(range))
    const classRanges = ranges.filter((r) => !this.isDataType(r))

    if (typeof value === 'object' && value !== null) {
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

    // A URL, or a reference like #eli-gundry, can name a thing
    if (classRanges.length && /^([a-z][a-z\d+.-]*:|[#/])/i.test(text)) {
      return undefined
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
