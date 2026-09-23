/** URL hash parameter holding a tailoring, e.g. `/resume/#t=…`. */
export const HASH_KEY = 't'

export const hasTailoringLink = (hash: string) =>
  new URLSearchParams(hash.replace(/^#/, '')).has(HASH_KEY)
