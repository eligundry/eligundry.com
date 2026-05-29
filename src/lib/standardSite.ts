import crypto from 'node:crypto'
import { eq } from 'drizzle-orm'
import * as dateFns from 'date-fns'
import {
  StandardSitePublisher,
  transformContent,
  generateDocumentLinkTag,
  getPublicationAtUri,
} from '@bryanguffey/astro-standard-site'
import { db, standardSiteDocuments } from './database'
import blueSky from './bluesky'
import daylio, { type DaylioEntry } from './daylio'
import config from '../config'

type StoredDocument = typeof standardSiteDocuments.$inferSelect

// Only announce posts on Bluesky (for comments) if they were published within
// this window. Without this, the first build would spam announcements for every
// historical post. Older posts still get a standard.site document, just no
// Bluesky comment thread.
const ANNOUNCE_MAX_AGE_DAYS = 30
// Cap how many *new* documents we publish per build so a first run doesn't try
// to write years of feelings to ATProto in one go (rate limits / build time).
// Remaining entries are picked up on subsequent builds (nightly + on new posts).
const MAX_NEW_PER_BUILD = 100

// Env vars must be referenced as static `import.meta.env.NAME` literals so
// Astro/Vite can statically replace them at build time (dynamic indexing like
// `import.meta.env[key]` is NOT replaced and would be undefined in the bundle).
// `import.meta.env` is the source in Astro builds/SSR; `process.env` is the
// fallback for standalone vite-node scripts, where import.meta.env is empty.
const firstSet = (...values: Array<string | undefined>): string | undefined =>
  values.find((value) => !!value)

const identifier = firstSet(
  import.meta.env.BLUESKY_USERNAME,
  process.env.BLUESKY_USERNAME
)
const password = firstSet(
  import.meta.env.BLUESKY_PASSWORD,
  process.env.BLUESKY_PASSWORD
)
const did = firstSet(
  import.meta.env.STANDARD_SITE_DID,
  process.env.STANDARD_SITE_DID
)
const publicationRkey = firstSet(
  import.meta.env.STANDARD_SITE_PUBLICATION_RKEY,
  process.env.STANDARD_SITE_PUBLICATION_RKEY
)

/**
 * Whether standard.site publishing is wired up. Gates every network action so
 * builds without credentials (e.g. local dev, forks) silently skip publishing
 * but can still render verification tags/comments from previously stored data.
 */
export function isConfigured(): boolean {
  return Boolean(identifier && password && did)
}

let publisherPromise: Promise<StandardSitePublisher> | null = null

/** Memoized, logged-in publisher shared across all page renders in a build. */
export async function getPublisher(): Promise<StandardSitePublisher> {
  if (!publisherPromise) {
    publisherPromise = (async () => {
      const publisher = new StandardSitePublisher({
        identifier: identifier!,
        password: password!,
        ...(did && publicationRkey
          ? { publication: getPublicationAtUri(did, publicationRkey) }
          : {}),
      })
      await publisher.login()
      return publisher
    })()
  }

  return publisherPromise
}

const hashContent = (parts: Array<string | undefined>): string =>
  crypto
    .createHash('sha256')
    .update(parts.map((p) => p ?? '').join('\n---\n'))
    .digest('hex')

export async function getStoredDocument(
  path: string
): Promise<StoredDocument | null> {
  try {
    const rows = await db
      .select()
      .from(standardSiteDocuments)
      .where(eq(standardSiteDocuments.path, path))
      .limit(1)
    return rows[0] ?? null
  } catch (e) {
    console.error(`[standard-site] failed to read stored document ${path}:`, e)
    return null
  }
}

/** Returns the `<link rel="site.standard.document">` tag for a post's `<head>`. */
export function getVerificationLinkTag(
  documentRkey?: string | null
): string | null {
  if (!documentRkey || !did) return null
  return generateDocumentLinkTag({ did, documentRkey })
}

interface PublishInput {
  path: string
  kind: (typeof standardSiteDocuments.$inferInsert)['kind']
  title: string
  body: string
  description?: string
  // Accepts a Date, ISO string, or epoch — remark frontmatter (e.g. the
  // git-last-modified date) can arrive as a string, so we coerce defensively.
  publishedAt: Date | string | number
  updatedAt?: Date | string | number
  tags?: string[]
  /** Path used to build the canonical URL; defaults to `path`. */
  canonicalPath?: string
  /** Post a Bluesky announcement (for comment threading) on first publish. */
  announce?: boolean
}

/** Coerce a Date | string | number into a valid Date, or undefined. */
const toDate = (value?: Date | string | number): Date | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/**
 * Publish (or update) a single standard.site document, deduping on a content
 * hash so unchanged content is never re-published. Returns the stored row and
 * whether a network write happened.
 */
async function publishDocument(
  input: PublishInput,
  preloadedExisting?: StoredDocument | null
): Promise<{ row: StoredDocument | null; changed: boolean }> {
  const canonicalPath = input.canonicalPath ?? input.path
  const { markdown, textContent } = transformContent(input.body ?? '', {
    siteUrl: config.url,
    postPath: canonicalPath,
  })
  const contentHash = hashContent([input.title, input.description, markdown])

  const existing =
    preloadedExisting !== undefined
      ? preloadedExisting
      : await getStoredDocument(input.path)

  // Without credentials we can't publish, but we still hand back whatever we
  // stored previously so pages can render comments/verification tags.
  if (!isConfigured()) {
    return { row: existing, changed: false }
  }

  if (existing && existing.contentHash === contentHash) {
    return { row: existing, changed: false }
  }

  const publisher = await getPublisher()

  const publishedAt = toDate(input.publishedAt) ?? new Date()
  const updatedAt = toDate(input.updatedAt)

  // Reuse an existing announcement post; otherwise create one for recent posts.
  let bskyPostUri = existing?.bskyPostUri ?? null
  let bskyPostCid = existing?.bskyPostCid ?? null
  const recentEnoughToAnnounce =
    dateFns.differenceInDays(new Date(), publishedAt) <= ANNOUNCE_MAX_AGE_DAYS

  if (input.announce && !bskyPostUri && recentEnoughToAnnounce) {
    const url = config.url + canonicalPath
    const res = await blueSky.sendPost(`${input.title}\n\n${url}`)
    bskyPostUri = res.uri
    bskyPostCid = res.cid
  }

  const docInput = {
    site: config.url,
    title: input.title,
    publishedAt: publishedAt.toISOString(),
    path: canonicalPath,
    description: input.description,
    updatedAt: updatedAt?.toISOString(),
    tags: input.tags,
    textContent,
    content: {
      $type: 'site.standard.content.markdown',
      text: markdown,
      version: '1.0',
    },
    ...(bskyPostUri && bskyPostCid
      ? { bskyPostRef: { uri: bskyPostUri, cid: bskyPostCid } }
      : {}),
  }

  const result = existing
    ? await publisher.updateDocument(existing.documentRkey, docInput)
    : await publisher.publishDocument(docInput)

  const documentRkey = result.uri.split('/').pop() as string
  const row: StoredDocument = {
    path: input.path,
    kind: input.kind,
    documentUri: result.uri,
    documentRkey,
    documentCid: result.cid,
    bskyPostUri,
    bskyPostCid,
    contentHash,
    publishedAt: existing?.publishedAt ?? new Date(),
    updatedAt: new Date(),
  }

  await db
    .insert(standardSiteDocuments)
    .values(row)
    .onConflictDoUpdate({
      target: standardSiteDocuments.path,
      set: {
        documentUri: row.documentUri,
        documentRkey: row.documentRkey,
        documentCid: row.documentCid,
        bskyPostUri: row.bskyPostUri,
        bskyPostCid: row.bskyPostCid,
        contentHash: row.contentHash,
        updatedAt: row.updatedAt,
      },
    })
    .run()

  return { row, changed: true }
}

export interface SyncResult {
  documentRkey?: string
  bskyPostUri?: string
}

const toSyncResult = (row: StoredDocument | null): SyncResult => ({
  documentRkey: row?.documentRkey,
  bskyPostUri: row?.bskyPostUri ?? undefined,
})

export async function syncBlogPost(args: {
  slug: string
  title: string
  description: string
  date: Date
  updated?: Date
  tags: string[]
  body: string
}): Promise<SyncResult> {
  try {
    const { row } = await publishDocument({
      path: `/blog/${args.slug}/`,
      kind: 'blog',
      title: args.title,
      description: args.description,
      publishedAt: args.date,
      updatedAt: args.updated,
      tags: args.tags,
      body: args.body,
      announce: true,
    })
    return toSyncResult(row)
  } catch (e) {
    console.error(`[standard-site] failed to publish blog "${args.slug}":`, e)
    return toSyncResult(await getStoredDocument(`/blog/${args.slug}/`))
  }
}

export async function syncLinkPost(args: {
  slug: string
  title: string
  description?: string
  url?: string
  date: Date
  tags: string[]
  body: string
}): Promise<SyncResult> {
  const path = `/blog/links/${args.slug}/`
  // Notion link posts can have empty bodies; fall back to the blurb + the URL.
  const body = args.body?.trim()
    ? args.body
    : [args.description, args.url].filter(Boolean).join('\n\n')

  try {
    const { row } = await publishDocument({
      path,
      kind: 'link',
      title: args.title,
      description: args.description,
      publishedAt: args.date,
      tags: args.tags,
      body,
      announce: true,
    })
    return toSyncResult(row)
  } catch (e) {
    console.error(`[standard-site] failed to publish link "${args.slug}":`, e)
    return toSyncResult(await getStoredDocument(path))
  }
}

/**
 * Publish public Daylio feelings as standard.site documents, mirroring the
 * /feelings.rss feed (all public entries, title via tweetPrefix, body = note).
 * Capped per build to avoid a huge backfill burst; converges over later builds.
 */
export async function syncFeelings(entries: DaylioEntry[]): Promise<void> {
  if (!isConfigured()) return

  let existingByPath = new Map<string, StoredDocument>()
  try {
    const rows = await db
      .select()
      .from(standardSiteDocuments)
      .where(eq(standardSiteDocuments.kind, 'feeling'))
    existingByPath = new Map(rows.map((row) => [row.path, row]))
  } catch (e) {
    console.error('[standard-site] failed to load existing feelings:', e)
    return
  }

  const now = new Date()
  let published = 0

  for (const entry of entries) {
    if (published >= MAX_NEW_PER_BUILD) break

    const path = `/feelings#${entry.slug}`
    try {
      const { changed } = await publishDocument(
        {
          path,
          kind: 'feeling',
          title: daylio.tweetPrefix(entry, now),
          publishedAt: entry.time,
          body: entry.note?.markdown ?? '',
          announce: false,
        },
        existingByPath.get(path) ?? null
      )
      if (changed) published += 1
    } catch (e) {
      console.error(`[standard-site] failed to publish feeling ${path}:`, e)
    }
  }
}

/** Publish a single hand-made static HTML page (used by the manual CLI). */
export async function publishStaticPage(args: {
  path: string
  title: string
  description?: string
  body: string
  publishedAt?: Date
}): Promise<StoredDocument | null> {
  const { row } = await publishDocument({
    path: args.path,
    kind: 'page',
    title: args.title,
    description: args.description,
    publishedAt: args.publishedAt ?? new Date(),
    body: args.body,
    announce: false,
  })
  return row
}
