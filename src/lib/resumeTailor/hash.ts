/** URL hash parameter holding a tailoring, e.g. `/resume/#t=…`. */
export const HASH_KEY = 't'

export const hasTailoringLink = (hash: string) =>
  new URLSearchParams(hash.replace(/^#/, '')).has(HASH_KEY)

/** URL hash parameter that opens the resume for editing, e.g. `/resume/#edit`. */
export const EDIT_KEY = 'edit'

export const hasEditLink = (hash: string) =>
  new URLSearchParams(hash.replace(/^#/, '')).has(EDIT_KEY)
