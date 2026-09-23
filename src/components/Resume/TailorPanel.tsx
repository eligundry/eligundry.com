import lodashTruncate from 'lodash/truncate'
import { useState } from 'preact/hooks'
import { markdownToPlain } from '../../lib/resume/markdown'
import type { Tailoring } from './useTailoring'

const truncate = (markdown: string | undefined) =>
  markdown &&
  lodashTruncate(markdownToPlain(markdown), {
    length: 160,
    separator: ' ',
    omission: '…',
  })

/**
 * Review panel for a tailored resume: shows who it was tailored for, every
 * change with its reason (each revertable), and print preview/sharing tools.
 */
export default function TailorPanel({
  tailoring,
  webmcp,
}: {
  tailoring: Tailoring
  webmcp: boolean
}) {
  const [copied, setCopied] = useState(false)
  const { tailored, state, review, preview, layout } = tailoring
  const { job } = tailored
  const changes = tailored.log.filter(
    (c) => c.op.type !== 'setJob' && c.op.type !== 'highlight'
  )

  if (!state.changes.length) {
    if (!webmcp) return null
    return (
      <aside class="paper print:hidden! text-sm opacity-70">
        This resume supports{' '}
        <a
          class="link"
          href="https://github.com/webmachinelearning/webmcp"
          target="_blank"
        >
          WebMCP
        </a>
        : ask your browser's AI agent to tailor it to a job posting.
      </aside>
    )
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(tailoring.shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside class="paper print:hidden! font-sans text-sm" aria-label="Tailoring">
      <div class="rounded-box border border-accent p-4 flex flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="m-0">
            <strong>
              Tailored
              {job?.company || job?.title
                ? ` for ${[job.title, job.company].filter(Boolean).join(' at ')}`
                : ''}
            </strong>
            {job?.url && (
              <>
                {' · '}
                <a class="link" href={job.url} target="_blank" rel="noopener">
                  posting
                </a>
              </>
            )}
            {' · '}
            <a class="link" href="/resume/">
              view original
            </a>
          </p>
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-xs" onClick={copyLink}>
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button class="btn btn-xs" onClick={() => window.print()}>
              Print / PDF
            </button>
            <button
              class="btn btn-xs btn-ghost"
              onClick={() => {
                if (confirm('Undo every tailoring change?')) tailoring.reset()
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <label class="label cursor-pointer gap-2">
            <input
              type="checkbox"
              class="toggle toggle-sm"
              checked={review}
              onChange={(e) => tailoring.setReview(e.currentTarget.checked)}
            />
            Show changes on the page
          </label>
          <label class="label cursor-pointer gap-2">
            <input
              type="checkbox"
              class="toggle toggle-sm"
              checked={preview}
              onChange={(e) => tailoring.setPreview(e.currentTarget.checked)}
            />
            Print preview
          </label>
        </div>

        {preview && layout && (
          <div>
            <p class="m-0">
              About {layout.pageCount} page{layout.pageCount === 1 ? '' : 's'}
              {layout.targetPages ? ` (target ${layout.targetPages})` : ''},
              last page {layout.lastPageFillPercent}% full.
            </p>
            {layout.hints.length > 0 && (
              <ul class="my-1 list-disc pl-5">
                {layout.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <details>
          <summary class="cursor-pointer">
            {changes.length} change{changes.length === 1 ? '' : 's'}
          </summary>
          <ol class="mt-2 flex flex-col gap-2 pl-5 list-decimal">
            {changes.map((change) => (
              <li key={change.id}>
                <div class="flex justify-between gap-2">
                  <span>
                    <code>{change.op.type}</code> {change.target}
                    {change.error && (
                      <span class="text-error"> — {change.error}</span>
                    )}
                  </span>
                  <button
                    class="btn btn-xs btn-ghost"
                    onClick={() => tailoring.revert(change.id)}
                  >
                    Revert
                  </button>
                </div>
                {change.reason && <p class="m-0 italic">{change.reason}</p>}
                {change.before && (
                  <p class="m-0">
                    <del>{truncate(change.before)}</del>
                  </p>
                )}
                {change.after && (
                  <p class="m-0">
                    <ins>{truncate(change.after)}</ins>
                  </p>
                )}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </aside>
  )
}
