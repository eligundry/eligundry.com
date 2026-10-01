import { useMemo } from 'preact/hooks'
import {
  editableMarkdown,
  indexResume,
  type ResumeSource,
} from '../../lib/resume/model'
import ResumeTools from './ResumeTools'
import ResumeView, { ResumeViewContext } from './ResumeView'
import TailorPanel from './TailorPanel'
import { useHighlights } from './useHighlights'
import { useTailoring } from './useTailoring'

const hasModelContext = () =>
  Boolean(document.modelContext ?? navigator.modelContext)

/**
 * The resume with tailoring: the review panel, the tailored resume and, when
 * the browser supports WebMCP, the tools agents use to tailor it. Loaded only
 * for tailored links, editing and WebMCP browsers.
 */
export default function TailoredResume({
  source,
  editing = false,
}: {
  source: ResumeSource
  editing?: boolean
}) {
  const tailoring = useTailoring(source, { editing })
  const { tailored, review, edit } = tailoring
  const webmcp = useMemo(hasModelContext, [])

  const originals = useMemo(() => indexResume(source), [source])
  const view = useMemo(
    () => ({
      review,
      breakBefore: tailored.print.breakBefore,
      original: (id: string) =>
        (originals.get(id)?.node as { html?: string } | undefined)?.html,
      edit: edit
        ? {
            markdown: (id: string) => editableMarkdown(tailored.source, id),
            save: (id: string, markdown: string) =>
              tailoring.editText(id, markdown),
          }
        : undefined,
    }),
    [review, edit, tailored, originals]
  )

  useHighlights(tailored.highlightTerms, [tailored, review])

  return (
    <>
      <TailorPanel tailoring={tailoring} webmcp={webmcp} />
      <ResumeViewContext.Provider value={view}>
        <ResumeView
          resume={tailored.source}
          density={tailored.print.density}
          fontScale={tailored.print.fontScale}
          onStartEdit={edit ? undefined : () => tailoring.setEdit(true)}
        />
      </ResumeViewContext.Provider>
      {webmcp && <ResumeTools tailoring={tailoring} />}
    </>
  )
}
