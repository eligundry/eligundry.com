// Types for the Worker's bindings. The workers-types are imported rather
// than loaded as globals, since their globals clash with the DOM's.
declare module 'cloudflare:workers' {
  import type {
    D1Database,
    Fetcher,
    KVNamespace,
    R2Bucket,
  } from '@cloudflare/workers-types'

  export const env: {
    DB: D1Database
    MEDIA: R2Bucket
    SESSION: KVNamespace
    ASSETS: Fetcher
  }
}
