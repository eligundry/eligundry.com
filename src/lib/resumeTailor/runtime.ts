import { h, render } from 'preact'
import TailorPanel from '../../components/Resume/TailorPanel'
import type { ResumeSource } from '../resume/model'
import { readHash } from './serialize'
import { TailorStore } from './store'
import { registerTools } from './webmcp'

/**
 * Boots tailoring on /resume/: restores a shared link, registers the WebMCP
 * tools and mounts the review panel above the resume.
 */
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
  const store = new TailorStore(base, root, await readHash(location.hash))
  store.webmcp = registerTools(store)
  window.__resumeTailor = store

  const panel = document.createElement('div')
  root.before(panel)
  render(h(TailorPanel, { store }), panel)
  return store
}
