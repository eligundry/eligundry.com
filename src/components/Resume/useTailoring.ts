import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import {
  toJsonResume,
  toSuperset,
  type ResumeSource,
} from '../../lib/resume/model'
import { HASH_KEY } from '../../lib/resumeTailor/hash'
import {
  measurePrintLayout,
  setPrintPreview,
  type PrintLayout,
} from '../../lib/resumeTailor/layout'
import {
  encodeState,
  parseOp,
  readHash,
} from '../../lib/resumeTailor/serialize'
import {
  addChange,
  emptyState,
  revertChange,
  tailor,
  type ChangeRecord,
  type Tailored,
  type TailorState,
} from '../../lib/resumeTailor/state'

const nextPaint = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

/**
 * Tailoring state for the resume: the change log, the tailored resume it
 * produces, and the actions the review panel and WebMCP tools use. The log is
 * kept in the URL hash so a tailored resume can be shared or reopened.
 */
export function useTailoring(base: ResumeSource) {
  const [state, setState] = useState<TailorState>(emptyState)
  // Tools can run several changes before the next render, so they read and
  // write the latest state through a ref.
  const stateRef = useRef(state)
  const tailored = useMemo(() => tailor(base, state), [base, state])
  const [review, setReview] = useState(false)
  const [preview, setPreview] = useState(false)
  const [layout, setLayout] = useState<PrintLayout>()
  const [shareUrl, setShareUrl] = useState('')

  const update = (next: TailorState) => {
    stateRef.current = next
    setState(next)
  }

  // Restore a shared link
  useEffect(() => {
    readHash(location.hash).then((restored) => restored && update(restored))
  }, [])

  // Keep the URL in sync
  useEffect(() => {
    const url = new URL(location.href)
    const params = new URLSearchParams(url.hash.slice(1))
    const write = (encoded?: string) => {
      if (encoded) params.set(HASH_KEY, encoded)
      else params.delete(HASH_KEY)
      url.hash = params.toString()
      history.replaceState(history.state, '', url)
      setShareUrl(url.toString())
    }
    if (state.changes.length) encodeState(state).then(write)
    else write()
  }, [state])

  useEffect(() => {
    if (tailored.job?.company || tailored.job?.title) {
      const job = [tailored.job.company, tailored.job.title].join(' ').trim()
      document.title = `${base.basics.name} – Resume – ${job}`
    }
  }, [tailored.job])

  const measure = async () => {
    await nextPaint()
    const next = await measurePrintLayout(
      tailor(base, stateRef.current).print.targetPages
    )
    setLayout(next)
    return next
  }

  useEffect(() => {
    setPrintPreview(preview)
    if (preview) void measure()
    else setLayout(undefined)
  }, [preview, tailored])

  return {
    base,
    state,
    tailored,
    review,
    setReview,
    preview,
    setPreview,
    layout,
    shareUrl,
    measure,

    /** The change log, including changes not rendered yet. */
    getState: () => stateRef.current,

    /** The tailored resume, including changes not rendered yet. */
    current: (): Tailored => tailor(base, stateRef.current),

    /** A link to the resume as tailored right now. */
    async link(): Promise<string> {
      const url = new URL(location.href)
      const params = new URLSearchParams(url.hash.slice(1))
      params.set(HASH_KEY, await encodeState(stateRef.current))
      url.hash = params.toString()
      return url.toString()
    },

    /** Validates and applies a change. Throws if it's invalid. */
    apply(op: unknown, reason: string): ChangeRecord {
      const { state: next, change } = addChange(
        base,
        stateRef.current,
        parseOp(op),
        reason
      )
      update(next)
      return change
    },

    revert: (changeId: string) =>
      update(revertChange(stateRef.current, changeId)),

    reset: () => update(emptyState()),

    /** The tailored resume as JSON Resume plus `x-` extensions. */
    superset: () => toSuperset(tailor(base, stateRef.current).source),

    /** The tailored resume as schema-valid JSON Resume. */
    jsonResume: () =>
      toJsonResume(toSuperset(tailor(base, stateRef.current).source)),
  }
}

export type Tailoring = ReturnType<typeof useTailoring>
