import { useMemo, useState } from 'preact/hooks'
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

/** Kinds of text that are items in a list, so saving them empty removes them. */
const LIST_ITEMS = new Set<string | undefined>([
  'highlight',
  'skill',
  'activity',
  'subItem',
])

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
  // A bullet just added by hand, to start editing once it's rendered.
  const [focusId, setFocusId] = useState<string>()

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
            save: (id: string, markdown: string) => {
              if (markdown) tailoring.editText(id, markdown)
              // Emptying a list item removes it; other text can't be empty.
              else if (
                LIST_ITEMS.has(indexResume(tailored.source).get(id)?.kind)
              )
                tailoring.removeItem(id)
            },
            addItem: (parentId: string) =>
              setFocusId(tailoring.addItem(parentId)),
            removeItem: (id: string) => tailoring.removeItem(id),
            moveItems: (parentId: string, ids: string[]) =>
              tailoring.moveItems(parentId, ids),
            setPrinted: (id: string, printed: boolean) =>
              tailoring.setPrinted(id, printed),
            focusId,
            clearFocus: () => setFocusId(undefined),
          }
        : undefined,
    }),
    [review, edit, tailored, originals, focusId]
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
