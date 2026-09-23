import type { SkillKeyword } from '../resume/model'
import type { Change, JobContext, Op, PrintOptions, TailorState } from './state'

// The tailoring log lives in the URL hash (`#t=…`), deflated and base64url
// encoded. The hash never reaches the server, so tailored links need no
// storage and stay out of request logs. Anything read from the hash is
// untrusted, so every op is validated on the way in.

import { HASH_KEY } from './hash'

const MAX_TEXT = 2000

class InvalidOp extends Error {}

function str(value: unknown, field: string, max = MAX_TEXT): string {
  if (typeof value !== 'string') {
    throw new InvalidOp(`${field} must be a string`)
  }
  if (value.length > max) {
    throw new InvalidOp(`${field} must be at most ${max} characters`)
  }
  return value
}

function optStr(value: unknown, field: string): string | undefined {
  return value === undefined || value === null ? undefined : str(value, field)
}

function strArray(value: unknown, field: string, max = 200): string[] {
  if (!Array.isArray(value)) {
    throw new InvalidOp(`${field} must be an array of strings`)
  }
  if (value.length > max) {
    throw new InvalidOp(`${field} must have at most ${max} entries`)
  }
  return value.map((v, i) => str(v, `${field}[${i}]`, 500))
}

function obj(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InvalidOp(`${field} must be an object`)
  }
  return value as Record<string, unknown>
}

function parseJob(value: unknown): JobContext {
  const job = obj(value, 'job')
  return {
    company: optStr(job.company, 'company'),
    title: optStr(job.title, 'title'),
    url: optStr(job.url, 'url'),
    requirements:
      job.requirements === undefined
        ? undefined
        : strArray(job.requirements, 'requirements'),
    keywords:
      job.keywords === undefined
        ? undefined
        : strArray(job.keywords, 'keywords'),
  }
}

function parseKeywords(value: unknown): SkillKeyword[] {
  if (!Array.isArray(value)) {
    throw new InvalidOp('keywords must be an array')
  }
  return value.map((keyword, i) => {
    if (typeof keyword === 'string') {
      return { name: str(keyword, `keywords[${i}]`, 100) }
    }
    const k = obj(keyword, `keywords[${i}]`)
    return {
      name: str(k.name, `keywords[${i}].name`, 100),
      url: optStr(k.url, `keywords[${i}].url`),
    }
  })
}

function parsePrint(value: unknown): Partial<PrintOptions> {
  const print = obj(value, 'print')
  const result: Partial<PrintOptions> = {}
  if (print.breakBefore !== undefined) {
    result.breakBefore = strArray(print.breakBefore, 'breakBefore')
  }
  if (print.density !== undefined) {
    if (print.density !== 'normal' && print.density !== 'compact') {
      throw new InvalidOp('density must be "normal" or "compact"')
    }
    result.density = print.density
  }
  if (print.fontScale !== undefined) {
    if (typeof print.fontScale !== 'number' || !isFinite(print.fontScale)) {
      throw new InvalidOp('fontScale must be a number')
    }
    result.fontScale = print.fontScale
  }
  if (print.targetPages !== undefined && print.targetPages !== null) {
    if (
      typeof print.targetPages !== 'number' ||
      !Number.isInteger(print.targetPages) ||
      print.targetPages < 1
    ) {
      throw new InvalidOp('targetPages must be a positive integer')
    }
    result.targetPages = print.targetPages
  }
  return result
}

/** Validates an untrusted operation. Throws with a readable message. */
export function parseOp(value: unknown): Op {
  const op = obj(value, 'op')
  switch (op.type) {
    case 'setJob':
      return { type: 'setJob', job: parseJob(op.job) }
    case 'setVisibility':
      if (typeof op.visible !== 'boolean') {
        throw new InvalidOp('visible must be a boolean')
      }
      return {
        type: 'setVisibility',
        ids: strArray(op.ids, 'ids'),
        visible: op.visible,
      }
    case 'reorder':
      return {
        type: 'reorder',
        container: str(op.container, 'container', 200),
        ids: strArray(op.ids, 'ids'),
      }
    case 'rewrite':
      return {
        type: 'rewrite',
        id: str(op.id, 'id', 200),
        markdown: str(op.markdown, 'markdown'),
      }
    case 'addItem':
      return {
        type: 'addItem',
        parentId: str(op.parentId, 'parentId', 200),
        id: str(op.id, 'id', 200),
        markdown: str(op.markdown, 'markdown'),
        after: optStr(op.after, 'after'),
      }
    case 'setSkillKeywords':
      return {
        type: 'setSkillKeywords',
        id: str(op.id, 'id', 200),
        keywords: parseKeywords(op.keywords),
      }
    case 'highlight':
      return { type: 'highlight', terms: strArray(op.terms, 'terms', 50) }
    case 'setPrint':
      return { type: 'setPrint', print: parsePrint(op.print) }
    default:
      throw new InvalidOp(`Unknown op type ${JSON.stringify(op.type)}`)
  }
}

/** Validates untrusted state, dropping changes that don't parse. */
export function parseState(value: unknown): TailorState {
  const state = obj(value, 'state')
  if (state.v !== 1 || !Array.isArray(state.changes)) {
    throw new InvalidOp('Unsupported tailoring state')
  }
  const changes: Change[] = []
  for (const raw of state.changes.slice(0, 500)) {
    try {
      const change = obj(raw, 'change')
      changes.push({
        id: str(change.id, 'id', 20),
        op: parseOp(change.op),
        reason: str(change.reason ?? '', 'reason'),
        at: str(change.at ?? '', 'at', 40),
      })
    } catch {
      // Skip anything malformed rather than rejecting the whole link.
    }
  }
  return { v: 1, changes }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

async function pipe(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream
): Promise<Uint8Array> {
  const body = (
    new Response(bytes).body as ReadableStream<Uint8Array>
  ).pipeThrough(stream as unknown as TransformStream<Uint8Array, Uint8Array>)
  return new Uint8Array(await new Response(body).arrayBuffer())
}

export async function encodeState(state: TailorState): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(state))
  return toBase64Url(await pipe(json, new CompressionStream('deflate-raw')))
}

export async function decodeState(encoded: string): Promise<TailorState> {
  const bytes = await pipe(
    fromBase64Url(encoded),
    new DecompressionStream('deflate-raw')
  )
  return parseState(JSON.parse(new TextDecoder().decode(bytes)))
}

/** Reads the tailoring state out of a URL hash like `#t=…`. */
export async function readHash(hash: string): Promise<TailorState | undefined> {
  const encoded = new URLSearchParams(hash.replace(/^#/, '')).get(HASH_KEY)
  if (!encoded) {
    return undefined
  }
  try {
    return await decodeState(encoded)
  } catch (error) {
    console.warn('Ignoring invalid resume tailoring link', error)
    return undefined
  }
}
