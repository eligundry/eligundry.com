import { createContext, type ComponentChildren, type JSX } from 'preact'
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'preact/hooks'
import { FaDownload, FaPen } from 'react-icons/fa'
import type {
  ActivityNode,
  ResumeSection,
  ResumeSource,
  SkillNode,
  TextNode,
} from '../../lib/resume/model'
import EditableList from './EditableList'
import Experience from './Experience'
import { useBulletDrag } from './useBulletDrag'

// Renders the resume from the resume model. The plain resume and a tailored
// one share this: tailoring only changes the model it's given and, through
// `ResumeViewContext`, how changes are shown.

export interface ResumeViewOptions {
  /** Show hidden items struck through and rewrites next to the original. */
  review: boolean
  /** The untailored HTML for a text node's id, if it has one. */
  original: (id: string) => string | undefined
  /** Ids that start a new printed page. */
  breakBefore: string[]
  /** Set while text can be edited on the page. */
  edit?: {
    /** The markdown a node is edited as, or undefined if it isn't editable. */
    markdown: (id: string) => string | undefined
    /** Saves edited markdown. Empty markdown removes a list item. */
    save: (id: string, markdown: string) => void
    /** Adds an empty item to a job, section or activity. */
    addItem: (parentId: string) => void
    removeItem: (id: string) => void
    /** Puts a list's items (`parentId`'s) in the order of `ids`. */
    moveItems: (parentId: string, ids: string[]) => void
    /** Puts a job or school on the printed resume, or leaves it off. */
    setPrinted: (id: string, printed: boolean) => void
    /** Text to start editing as soon as it's rendered, e.g. a new bullet. */
    focusId?: string
    clearFocus: () => void
  }
}

export const ResumeViewContext = createContext<ResumeViewOptions>({
  review: false,
  original: () => undefined,
  breakBefore: [],
})

export const cx = (...classes: unknown[]) =>
  classes.filter(Boolean).join(' ') || undefined

/**
 * Attributes shared by everything tailoring can target. Hidden items aren't
 * rendered, except struck through in review mode.
 */
export function useItemProps(
  item: { id: string; hidden?: boolean },
  className?: string | false
) {
  const { review, breakBefore } = useContext(ResumeViewContext)
  return {
    visible: !item.hidden || review,
    props: {
      'data-resume-id': item.id,
      'data-tailor-break-before': breakBefore.includes(item.id) || undefined,
      class: cx(className, item.hidden && 'tailor-hidden'),
    },
  }
}

type RichProps = {
  as?: 'li' | 'p' | 'span' | 'h2'
  /** Rendered markdown. Without it, `children` are shown instead. */
  node: { id: string; html?: string }
} & Omit<JSX.HTMLAttributes<HTMLElement>, 'as'>

/**
 * Rendered markdown, with the original alongside it in review mode. In edit
 * mode it can be clicked to edit its markdown.
 */
export function Rich({ as = 'span', node, children, ...props }: RichProps) {
  // The tags share the attributes used here, so type them as one.
  const Tag = as as 'span'
  const { review, original, edit } = useContext(ResumeViewContext)
  const before = original(node.id)

  if (edit?.markdown(node.id) !== undefined) {
    return (
      <EditableText as={as} node={node} {...props}>
        {children}
      </EditableText>
    )
  }
  if (node.html === undefined) {
    return <Tag {...props}>{children}</Tag>
  }
  if (!review || before === node.html) {
    return <Tag {...props} dangerouslySetInnerHTML={{ __html: node.html }} />
  }
  return (
    <Tag {...props}>
      {before !== undefined && (
        <>
          <del
            class="tailor-del"
            dangerouslySetInnerHTML={{ __html: before }}
          />{' '}
        </>
      )}
      <ins class="tailor-ins" dangerouslySetInnerHTML={{ __html: node.html }} />
    </Tag>
  )
}

const placeCaretAtEnd = (element: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)
  getSelection()?.removeAllRanges()
  getSelection()?.addRange(range)
}

/**
 * Text that shows its markdown source while focused and saves it as a hand
 * edit when it loses focus. Enter saves, Shift+Enter adds a line break and
 * Escape cancels.
 *
 * It's only contenteditable while being edited: browsers render
 * `plaintext-only` text with `white-space: pre-wrap`, which would turn the
 * line breaks in the content's source into visible ones.
 */
function EditableText({ as = 'span', node, children, ...props }: RichProps) {
  const Tag = as as 'span'
  const { edit } = useContext(ResumeViewContext)
  const ref = useRef<HTMLElement>(null)
  const cancelled = useRef(false)
  // A click that starts editing would put the caret where the rendered text
  // was, which means nothing in the markdown, so it goes to the end instead.
  const started = useRef(false)
  // The markdown being edited, while focused.
  const [draft, setDraft] = useState<string>()
  const editing = draft !== undefined

  useEffect(() => {
    if (!edit?.focusId || edit.focusId !== node.id) return
    edit.clearFocus()
    ref.current?.focus()
  }, [edit?.focusId])

  useLayoutEffect(() => {
    const element = ref.current
    if (!editing || !element) return
    // Focus may have started on a link inside, which the markdown replaced.
    if (document.activeElement !== element) element.focus()
    placeCaretAtEnd(element)
  }, [editing])

  const finish = (event: FocusEvent) => {
    // Ignore a link inside losing focus; only leaving this text finishes.
    if (event.target !== event.currentTarget) return
    if (!editing) return
    const text = cancelled.current
      ? draft
      : ((event.currentTarget as HTMLElement).textContent ?? '')
    cancelled.current = false
    started.current = false
    setDraft(undefined)
    // Saving nothing removes the text (a new bullet left empty, say).
    if (!text.trim() || text.trim() !== draft.trim()) {
      edit?.save(node.id, text.trim())
    }
  }

  const content = editing
    ? { children: draft }
    : node.html !== undefined
      ? { dangerouslySetInnerHTML: { __html: node.html } }
      : { children }

  return (
    <Tag
      {...props}
      {...content}
      ref={ref}
      class={cx(props.class, 'tailor-editable')}
      tabIndex={0}
      contenteditable={editing ? 'plaintext-only' : undefined}
      spellcheck={editing}
      title="Edit (markdown)"
      onFocus={() => {
        if (editing) return
        started.current = true
        setDraft(edit?.markdown(node.id) ?? '')
      }}
      // In edit mode a click on a link edits the text instead of following it.
      onMouseDown={(event) => {
        if (editing || !(event.target as Element).closest('a')) return
        event.preventDefault()
        event.currentTarget.focus()
      }}
      onClick={(event) => {
        if ((event.target as Element).closest('a')) event.preventDefault()
      }}
      onMouseUp={(event) => {
        if (!started.current) return
        started.current = false
        placeCaretAtEnd(event.currentTarget)
      }}
      onBlur={finish}
      onKeyDown={(event) => {
        started.current = false
        if (event.key === 'Escape') cancelled.current = true
        if (
          event.key === 'Escape' ||
          (event.key === 'Enter' && !event.shiftKey)
        ) {
          event.preventDefault()
          event.currentTarget.blur()
        }
      }}
    />
  )
}

function Section({
  section,
  className,
  header,
  children,
}: {
  section: ResumeSection
  className?: string
  header?: ComponentChildren
  children: ComponentChildren
}) {
  const { visible, props } = useItemProps(
    section,
    cx('prose flex flex-col gap-2', className)
  )
  if (!visible) return null

  const titleId = `${section.id}:title`
  const title = section.printTitle ? (
    <>
      <Rich
        as="h2"
        class="my-0 text-lg block print:hidden"
        node={{ id: titleId }}
      >
        {section.title}
      </Rich>
      <h2 class="my-0 text-lg hidden print:block">{section.printTitle}</h2>
    </>
  ) : (
    <Rich as="h2" class="my-0 text-lg" node={{ id: titleId }}>
      {section.title}
    </Rich>
  )

  return (
    <section {...props}>
      <header
        class="flex justify-between border-b-2 border-b-accent"
        data-print-unit={titleId}
        data-print-heading
      >
        {title}
        {header}
      </header>
      {children}
    </section>
  )
}

/** A section's jobs or schools, which can be dragged into a new order. */
function ExperienceList({
  section,
}: {
  section: Extract<ResumeSection, { id: 'section:work' | 'section:education' }>
}) {
  const { edit } = useContext(ResumeViewContext)
  const items = section.items
  const shown = items.filter((item) => !item.hidden).map((item) => item.id)
  const drag = useBulletDrag(
    items.map((item) => item.id),
    shown,
    edit && ((ids) => edit.moveItems(section.id, ids))
  )
  return (
    <>
      {items.map((experience) => (
        <Experience
          key={experience.id}
          experience={experience}
          drag={{
            handle: drag.handleProps(experience.id),
            dragging: drag.dragging === experience.id,
            dropBefore: drag.drop === experience.id,
            dropAfter:
              drag.drop === 'end' && experience.id === shown[shown.length - 1],
          }}
        />
      ))}
    </>
  )
}

/** "a", "a and b" or "a, b, and c". */
function joinWithAnd(items: ComponentChildren[]): ComponentChildren[] {
  return items.flatMap((item, i) => {
    if (i === 0) return [item]
    if (i === items.length - 1)
      return [items.length > 2 ? ', and ' : ' and ', item]
    return [', ', item]
  })
}

function SkillLine({ skill }: { skill: SkillNode }) {
  const keywords = skill.keywords.map((keyword) =>
    keyword.url ? (
      <a href={keyword.url} itemProp="knowsAbout" target="_blank">
        {keyword.name}
      </a>
    ) : (
      <span itemProp="knowsAbout">{keyword.name}</span>
    )
  )
  return (
    <Rich node={{ id: skill.id, html: skill.html }}>
      {skill.lead} {joinWithAnd(keywords)}.
    </Rich>
  )
}

/** An activity's sub-items, e.g. the hackathons. */
function SubItems({ activity }: { activity: ActivityNode }) {
  return (
    <EditableList
      parentId={activity.id}
      items={activity.children ?? []}
      class={cx(
        activity.childrenClass,
        // Columns would otherwise start at different heights.
        '[&>li]:my-0 [&>li]:break-inside-avoid'
      )}
      addLabel="Add sub-item"
      nested
      renderItem={(child) => <Rich node={child} />}
    />
  )
}

const actions = (onStartEdit?: () => void) => (
  <>
    <h6 class="self-center italic text-neutral-900 text-xs hidden print:block!">
      View full resume at <a href="/resume/">eligundry.com/resume/</a>
    </h6>
    <span class="flex print:hidden!">
      {onStartEdit && (
        <button
          class="btn btn-sm btn-ghost sm:tooltip sm:tooltip-primary sm:tooltip-left self-start normal-case print:hidden!"
          data-tip="Edit this resume. Changes stay in your browser and its link."
          aria-label="Edit this resume"
          onClick={onStartEdit}
        >
          <FaPen />
        </button>
      )}
      <button
        class="print-button btn btn-sm btn-ghost sm:tooltip sm:tooltip-primary sm:tooltip-left self-start normal-case print:hidden! sm:inline"
        data-tip="Download this resume by printing it as a PDF"
        aria-label="Download this resume by printing it as a PDF"
        onClick={() => window.print()}
      >
        <FaDownload />
      </button>
    </span>
  </>
)

export default function ResumeView({
  resume,
  density = 'normal',
  fontScale = 1,
  onStartEdit,
}: {
  resume: ResumeSource
  density?: 'normal' | 'compact'
  fontScale?: number
  /** Shows an edit button that calls this. */
  onStartEdit?: () => void
}) {
  const { basics } = resume

  return (
    <div
      class="paper gap-4 print:gap-3 flex flex-col [&_.prose_ul]:list-outside [&_.prose_ul]:pl-1 [&_.prose_ul]:sm:pl-0 [&_.prose_ul]:print:pl-4 [&_.prose_ul_li]:pl-0 [&_.prose_ul_ul]:pl-4 [&_.prose_ul_ul]:my-0 [&_.prose]:print:text-sm"
      data-resume-root
      data-tailor-density={density}
      style={fontScale === 1 ? undefined : { '--tailor-font-scale': fontScale }}
    >
      <header
        class="hidden print:flex flex-row items-baseline justify-between gap-4 prose border-b-2 border-b-accent"
        data-print-unit="basics"
      >
        <h1 class="text-lg mb-0 whitespace-nowrap">{basics.name}</h1>
        {/* The headline is styled like code: the label, then the tagline as a
            comment. It stays on one line. */}
        <h2 class="text-base my-0 font-mono! whitespace-nowrap">
          <Rich class="text-primary" node={basics.label} />{' '}
          <span class="font-normal text-gray-500">
            // <Rich node={basics.tagline} />
          </span>
        </h2>
      </header>
      {basics.summary.markdown && (
        <section
          class="prose flex flex-col gap-2"
          data-resume-id={basics.summary.id}
        >
          <header class="flex justify-between border-b-2 border-b-accent">
            <h2 class="my-0 text-lg">Summary</h2>
          </header>
          <Rich
            as="p"
            class="my-0"
            node={basics.summary}
            data-print-unit={basics.summary.id}
          />
        </section>
      )}
      {resume.sections.map((section) => {
        switch (section.id) {
          case 'section:work':
          case 'section:education':
            return (
              <Section
                key={section.id}
                section={section}
                header={section.id === 'section:work' && actions(onStartEdit)}
              >
                <ExperienceList section={section} />
              </Section>
            )
          case 'section:skills':
            return (
              <Section
                key={section.id}
                section={section}
                className="[&>ul]:my-0"
              >
                <EditableList
                  parentId={section.id}
                  items={section.items}
                  addLabel="Add skill line"
                  printUnits
                  renderItem={(skill) => <SkillLine skill={skill} />}
                />
              </Section>
            )
          case 'section:activities':
            return (
              <Section
                key={section.id}
                section={section}
                className="[&>ul]:my-0"
              >
                <EditableList
                  parentId={section.id}
                  items={section.items}
                  addLabel="Add activity"
                  printUnits
                  renderItem={(activity) => <Rich node={activity} />}
                  renderSublist={(activity) => <SubItems activity={activity} />}
                />
              </Section>
            )
        }
      })}
    </div>
  )
}
