import {
  indexResume,
  skillMarkdown,
  type ActivityNode,
  type ResumeSection,
  type ResumeSource,
  type SkillNode,
  type TextNode,
} from '../resume/model'
import {
  isSafeUrl,
  markdownToPlain,
  type SkillKeyword,
} from '../resume/markdown'

// Tailoring is an append-only log of operations replayed over the pristine
// resume. Reverting a change drops it from the log and replays the rest, so
// undoing something in the middle never corrupts later edits. The log is also
// what gets saved in the URL.

export interface JobContext {
  company?: string
  title?: string
  url?: string
  requirements?: string[]
  keywords?: string[]
}

export interface PrintOptions {
  breakBefore: string[]
  density: 'normal' | 'compact'
  fontScale: number
  targetPages?: number
}

export const DEFAULT_PRINT: PrintOptions = {
  breakBefore: [],
  density: 'normal',
  fontScale: 1,
}

export type Op =
  | { type: 'setJob'; job: JobContext }
  | { type: 'setVisibility'; ids: string[]; visible: boolean }
  | { type: 'reorder'; container: string; ids: string[] }
  | { type: 'rewrite'; id: string; markdown: string }
  | {
      type: 'addItem'
      parentId: string
      id: string
      markdown: string
      after?: string
    }
  | { type: 'setSkillKeywords'; id: string; keywords: SkillKeyword[] }
  | { type: 'highlight'; terms: string[] }
  | { type: 'setPrint'; print: Partial<PrintOptions> }

export interface Change {
  id: string
  op: Op
  reason: string
  at: string
}

export interface TailorState {
  v: 1
  changes: Change[]
}

export interface ChangeRecord extends Change {
  target: string
  before?: string
  after?: string
  error?: string
}

export interface Tailored {
  source: ResumeSource
  job?: JobContext
  highlightTerms: string[]
  print: PrintOptions
  log: ChangeRecord[]
}

export const emptyState = (): TailorState => ({ v: 1, changes: [] })

export class TailorError extends Error {}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

// ---------------------------------------------------------------------------
// Containers: things whose children can be reordered.

type Container = { ids: () => string[]; set: (ids: string[]) => void }

function getContainer(source: ResumeSource, id: string): Container {
  if (id === 'sections') {
    return {
      ids: () => source.sections.map((s) => s.id),
      set: (ids) => {
        source.sections = ids.map(
          (sid) => source.sections.find((s) => s.id === sid)!
        )
      },
    }
  }

  const ref = indexResume(source).get(id)
  if (ref?.kind === 'section') {
    const section = ref.node
    return {
      ids: () => section.items.map((item) => item.id),
      set: (ids) => {
        const items = section.items as { id: string }[]
        section.items = ids.map(
          (iid) => items.find((item) => item.id === iid)!
        ) as ResumeSection['items']
      },
    }
  }
  if (ref?.kind === 'experience') {
    const experience = ref.node
    return {
      ids: () => experience.highlights.map((h) => h.id),
      set: (ids) => {
        experience.highlights = ids.map(
          (hid) => experience.highlights.find((h) => h.id === hid)!
        )
      },
    }
  }

  throw new TailorError(
    `"${id}" can't be reordered. Use "sections", a section id (e.g. "section:work") or an experience id.`
  )
}

// ---------------------------------------------------------------------------
// Applying operations

interface Applied {
  target: string
  before?: string
  after?: string
}

function describeText(markdown: string | undefined): string | undefined {
  return markdown === undefined ? undefined : markdown
}

function applyOp(tailored: Tailored, op: Op): Applied {
  const { source } = tailored
  const index = indexResume(source)
  const lookup = (id: string) => {
    const ref = index.get(id)
    if (!ref) {
      throw new TailorError(
        `Unknown id "${id}". Call get_resume for valid ids.`
      )
    }
    return ref
  }

  switch (op.type) {
    case 'setJob': {
      const before = tailored.job
      tailored.job = { ...tailored.job, ...op.job }
      return {
        target: 'job',
        before: before ? JSON.stringify(before) : undefined,
        after: JSON.stringify(tailored.job),
      }
    }

    case 'setVisibility': {
      if (!op.ids.length) {
        throw new TailorError('ids must not be empty')
      }
      const refs = op.ids.map(lookup)
      for (const ref of refs) {
        if (ref.kind === 'sectionTitle' || ref.kind === 'basics') {
          throw new TailorError(
            `"${ref.node.id}" can't be hidden; rewrite it instead.`
          )
        }
        const node = ref.node as { hidden?: boolean; printHide?: boolean }
        node.hidden = !op.visible
        // Explicitly showing a job that's normally left off the printed
        // resume puts it back in print too.
        if (op.visible && ref.kind === 'experience') {
          node.printHide = false
        }
      }
      return {
        target: op.ids.join(', '),
        before: undefined,
        after: op.visible ? 'shown' : 'hidden',
      }
    }

    case 'reorder': {
      const container = getContainer(source, op.container)
      const current = container.ids()
      const unknown = op.ids.filter((id) => !current.includes(id))
      if (unknown.length) {
        throw new TailorError(
          `${unknown.join(', ')} ${unknown.length > 1 ? 'are' : 'is'} not in "${op.container}". It contains: ${current.join(', ')}`
        )
      }
      if (new Set(op.ids).size !== op.ids.length) {
        throw new TailorError('ids must not contain duplicates')
      }
      // Anything left out keeps its relative order after the listed ids.
      const next = [...op.ids, ...current.filter((id) => !op.ids.includes(id))]
      container.set(next)
      return {
        target: op.container,
        before: current.join(', '),
        after: next.join(', '),
      }
    }

    case 'rewrite': {
      const markdown = op.markdown.trim()
      if (op.id.endsWith(':summary') && !index.has(op.id)) {
        // Experiences without a summary paragraph can be given one.
        const ref = lookup(op.id.slice(0, -':summary'.length))
        if (ref.kind !== 'experience') {
          throw new TailorError(`Unknown id "${op.id}"`)
        }
        ref.node.summary = { id: op.id, markdown, added: true }
        return { target: op.id, after: markdown }
      }

      const ref = lookup(op.id)
      switch (ref.kind) {
        case 'experience':
          throw new TailorError(
            `"${op.id}" is locked: organization, position, dates and location are facts. Rewrite its bullets ("${op.id}:0") or summary ("${op.id}:summary") instead.`
          )
        case 'section':
          throw new TailorError(`Rewrite "${op.id}:title" to rename a section.`)
        case 'sectionTitle': {
          const before = ref.node.title
          ref.node.title = markdownToPlain(markdown)
          ref.node.printTitle = undefined
          return { target: op.id, before, after: ref.node.title }
        }
        case 'skill': {
          const before = skillMarkdown(ref.node)
          ref.node.markdown = markdown
          return { target: op.id, before, after: markdown }
        }
        case 'activity':
        case 'highlight':
        case 'summary':
        case 'basics': {
          const node = ref.node as TextNode | ActivityNode
          const before = describeText(node.markdown)
          node.markdown = markdown
          return { target: op.id, before, after: markdown }
        }
      }
      throw new TailorError(`"${op.id}" can't be rewritten`)
    }

    case 'addItem': {
      if (index.has(op.id)) {
        throw new TailorError(`"${op.id}" already exists`)
      }
      const markdown = op.markdown.trim()
      const ref = lookup(op.parentId)
      let list: { id: string }[]
      let item: TextNode | SkillNode | ActivityNode

      if (ref.kind === 'experience') {
        list = ref.node.highlights
        item = { id: op.id, markdown, added: true }
      } else if (ref.kind === 'section' && ref.node.id === 'section:skills') {
        list = ref.node.items
        item = {
          id: op.id,
          name: markdownToPlain(markdown).slice(0, 60),
          lead: '',
          keywords: [],
          markdown,
          added: true,
        }
      } else if (
        ref.kind === 'section' &&
        ref.node.id === 'section:activities'
      ) {
        list = ref.node.items
        item = { id: op.id, markdown, records: [], added: true }
      } else {
        throw new TailorError(
          `Items can only be added to an experience id, "section:skills" or "section:activities"`
        )
      }

      const afterIndex = op.after
        ? list.findIndex((existing) => existing.id === op.after)
        : list.length - 1
      if (op.after && afterIndex === -1) {
        throw new TailorError(`"${op.after}" is not in "${op.parentId}"`)
      }
      list.splice(afterIndex + 1, 0, item)
      return { target: op.id, after: markdown }
    }

    case 'setSkillKeywords': {
      const ref = lookup(op.id)
      if (ref.kind !== 'skill') {
        throw new TailorError(`"${op.id}" is not a skill line`)
      }
      const before = ref.node.keywords.map((k) => k.name).join(', ')
      // Keep the known link for keywords that were already listed anywhere.
      const known = new Map<string, string | undefined>()
      for (const section of source.sections) {
        if (section.id !== 'section:skills') continue
        for (const skill of section.items) {
          for (const keyword of skill.keywords) {
            known.set(keyword.name.toLowerCase(), keyword.url)
          }
        }
      }
      ref.node.keywords = op.keywords.map(({ name, url }) => ({
        name,
        url: url && isSafeUrl(url) ? url : known.get(name.toLowerCase()),
      }))
      ref.node.markdown = undefined
      return {
        target: op.id,
        before,
        after: ref.node.keywords.map((k) => k.name).join(', '),
      }
    }

    case 'highlight': {
      const before = tailored.highlightTerms.join(', ')
      tailored.highlightTerms = [...op.terms]
      return { target: 'highlights', before, after: op.terms.join(', ') }
    }

    case 'setPrint': {
      const before = tailored.print
      const next = { ...before, ...op.print }
      for (const id of op.print.breakBefore ?? []) {
        lookup(id)
      }
      if (next.fontScale < 0.8 || next.fontScale > 1.1) {
        throw new TailorError('fontScale must be between 0.8 and 1.1')
      }
      tailored.print = next
      return {
        target: 'print',
        before: JSON.stringify(before),
        after: JSON.stringify(next),
      }
    }
  }
}

/** Replays the change log over a copy of the pristine resume. */
export function tailor(base: ResumeSource, state: TailorState): Tailored {
  const tailored: Tailored = {
    source: clone(base),
    highlightTerms: [],
    print: { ...DEFAULT_PRINT },
    log: [],
  }

  for (const change of state.changes) {
    try {
      tailored.log.push({ ...change, ...applyOp(tailored, change.op) })
    } catch (error) {
      tailored.log.push({
        ...change,
        target: '',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return tailored
}

/**
 * Validates `op` against the current tailoring and appends it. Throws a
 * `TailorError` (without changing anything) when it can't be applied.
 */
export function addChange(
  base: ResumeSource,
  state: TailorState,
  op: Op,
  reason: string
): { state: TailorState; change: ChangeRecord; tailored: Tailored } {
  const change: Change = {
    id: nextChangeId(state),
    op,
    reason,
    at: new Date().toISOString(),
  }
  const next: TailorState = { ...state, changes: [...state.changes, change] }
  const tailored = tailor(base, next)
  const record = tailored.log[tailored.log.length - 1]

  if (record.error) {
    throw new TailorError(record.error)
  }

  return { state: next, change: record, tailored }
}

export function revertChange(
  state: TailorState,
  changeId: string
): TailorState {
  if (!state.changes.some((c) => c.id === changeId)) {
    throw new TailorError(`No change with id "${changeId}"`)
  }
  return { ...state, changes: state.changes.filter((c) => c.id !== changeId) }
}

function nextChangeId(state: TailorState): string {
  const max = state.changes.reduce(
    (n, c) => Math.max(n, Number(c.id.replace(/\D/g, '')) || 0),
    0
  )
  return `c${max + 1}`
}

/** A new id for an added item, unique across the log. */
export function newItemId(parentId: string, state: TailorState): string {
  const parent = parentId.replace(/^section:/, '')
  const max = state.changes.reduce((n, c) => {
    const suffix = c.op.type === 'addItem' && c.op.id.match(/:\+(\d+)$/)
    return suffix ? Math.max(n, Number(suffix[1])) : n
  }, 0)
  return `${parent}:+${max + 1}`
}
