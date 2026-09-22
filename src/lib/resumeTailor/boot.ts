/** URL hash parameter holding the tailoring, e.g. `/resume/#t=…`. */
export const HASH_KEY = 't'

/**
 * Wires up /resume/. The tailoring runtime is only downloaded when it's
 * needed: for a tailored link, or when the browser supports WebMCP.
 */
export function bootResume() {
  document.querySelector('.print-button')?.addEventListener('click', () => {
    window.print()
  })

  const hasTailoring = new URLSearchParams(location.hash.slice(1)).has(HASH_KEY)
  if (hasTailoring || navigator.modelContext) {
    import('./runtime').then(({ start }) => start())
  }
}
