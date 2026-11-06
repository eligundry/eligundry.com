// Stands in for ./index in the Worker bundle (see astro.config.mjs). Notes are
// only rendered at build time, and Sätteri's native binding can't load in
// workerd.
export const renderNote = async (): Promise<never> => {
  throw new Error('Daylio notes are only rendered at build time')
}
