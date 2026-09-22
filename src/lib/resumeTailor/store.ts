import { toJsonResume, toSuperset, type ResumeSource } from '../resume/model'
import { ResumeDom } from './dom'
import { measurePrintLayout, setPrintPreview, type PrintLayout } from './layout'
import { encodeState, HASH_KEY } from './serialize'
import {
  addChange,
  emptyState,
  revertChange,
  tailor,
  type ChangeRecord,
  type Op,
  type Tailored,
  type TailorState,
} from './state'

export interface TailorSnapshot {
  state: TailorState
  tailored: Tailored
  review: boolean
  preview: boolean
  layout?: PrintLayout
  shareUrl: string
  webmcp: boolean
}

type Listener = (snapshot: TailorSnapshot) => void

/** Owns the tailoring state and keeps the page and URL in sync with it. */
export class TailorStore {
  private listeners = new Set<Listener>()
  private dom: ResumeDom
  state: TailorState
  tailored: Tailored
  review = false
  preview = false
  layout?: PrintLayout
  shareUrl = location.href
  webmcp = false

  constructor(
    readonly base: ResumeSource,
    root: HTMLElement,
    initial: TailorState = emptyState()
  ) {
    this.dom = new ResumeDom(root, base)
    this.state = initial
    this.tailored = tailor(base, initial)
    this.dom.render(this.tailored)
  }

  get snapshot(): TailorSnapshot {
    return {
      state: this.state,
      tailored: this.tailored,
      review: this.review,
      preview: this.preview,
      layout: this.layout,
      shareUrl: this.shareUrl,
      webmcp: this.webmcp,
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.snapshot)
    return () => this.listeners.delete(listener)
  }

  private async commit(
    state: TailorState,
    tailored = tailor(this.base, state)
  ) {
    this.state = state
    this.tailored = tailored
    this.layout = undefined
    this.dom.render(tailored)
    await this.syncUrl()
    this.emit()
    if (this.preview) {
      void this.measure()
    }
  }

  private emit() {
    const snapshot = this.snapshot
    this.listeners.forEach((listener) => listener(snapshot))
  }

  private async syncUrl() {
    const url = new URL(location.href)
    const params = new URLSearchParams(url.hash.replace(/^#/, ''))
    if (this.state.changes.length) {
      params.set(HASH_KEY, await encodeState(this.state))
    } else {
      params.delete(HASH_KEY)
    }
    const hash = params.toString()
    url.hash = hash ? `#${hash}` : ''
    history.replaceState(history.state, '', url)
    this.shareUrl = url.toString()
  }

  /** Validates and applies a change. Throws `TailorError` if it's invalid. */
  async apply(op: Op, reason: string): Promise<ChangeRecord> {
    const { state, change, tailored } = addChange(
      this.base,
      this.state,
      op,
      reason
    )
    await this.commit(state, tailored)
    return change
  }

  async revert(changeId: string) {
    await this.commit(revertChange(this.state, changeId))
  }

  async reset() {
    await this.commit(emptyState())
  }

  setReview(on: boolean) {
    this.review = on
    document.documentElement.toggleAttribute('data-tailor-review', on)
    this.emit()
  }

  async setPreview(on: boolean) {
    this.preview = on
    setPrintPreview(on)
    if (on) {
      await this.measure()
    } else {
      this.layout = undefined
    }
    this.emit()
  }

  async measure(): Promise<PrintLayout> {
    this.layout = await measurePrintLayout(this.tailored.print.targetPages)
    this.emit()
    return this.layout
  }

  /** The tailored resume as JSON Resume plus `x-` extensions. */
  superset() {
    return toSuperset(this.tailored.source)
  }

  /** The tailored resume as schema-compliant JSON Resume. */
  jsonResume() {
    return toJsonResume(this.superset())
  }
}

declare global {
  interface Window {
    __resumeTailor?: TailorStore
  }
}

export const READY_EVENT = 'resume-tailor:ready'
