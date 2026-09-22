import type { ResumeSource } from '../resume/model'
import { readHash } from './serialize'
import { READY_EVENT, TailorStore } from './store'
import { registerTools } from './webmcp'

/** Boots tailoring on /resume/: restores a shared link and registers tools. */
export async function start(): Promise<TailorStore | undefined> {
  if (window.__resumeTailor) {
    return window.__resumeTailor
  }

  const root = document.querySelector<HTMLElement>('[data-resume-root]')
  const data = document.getElementById('resume-source')
  if (!root || !data?.textContent) {
    return undefined
  }

  const base = JSON.parse(data.textContent) as ResumeSource
  const initial = await readHash(location.hash)
  const store = new TailorStore(base, root, initial ?? undefined)
  store.webmcp = registerTools(store)
  window.__resumeTailor = store
  window.dispatchEvent(new CustomEvent(READY_EVENT))
  return store
}
