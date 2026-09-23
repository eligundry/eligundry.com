import { createContext, type ComponentChildren, type JSX } from 'preact'
import { useContext } from 'preact/hooks'
import { FaDownload } from 'react-icons/fa'
import type {
  ActivityNode,
  ResumeSection,
  ResumeSource,
  SkillNode,
  TextNode,
} from '../../lib/resume/model'
import Experience from './Experience'

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
  as?: 'li' | 'p' | 'span'
  node: Pick<TextNode, 'id' | 'html'>
} & Omit<JSX.HTMLAttributes<HTMLElement>, 'as'>

/** Rendered markdown, with the original alongside it in review mode. */
export function Rich({ as = 'span', node, ...props }: RichProps) {
  // The tags share the attributes used here, so type them as one.
  const Tag = as as 'span'
  const { review, original } = useContext(ResumeViewContext)
  const before = original(node.id)

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
      <h2 class="my-0 text-lg block print:hidden">{section.title}</h2>
      <h2 class="my-0 text-lg hidden print:block">{section.printTitle}</h2>
    </>
  ) : (
    <h2 class="my-0 text-lg">{section.title}</h2>
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
  const { visible, props } = useItemProps(skill)
  if (!visible) return null

  if (skill.html !== undefined) {
    return (
      <Rich
        as="li"
        {...props}
        node={{ id: skill.id, html: skill.html }}
        data-print-unit={skill.id}
      />
    )
  }

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
    <li {...props} data-print-unit={skill.id}>
      {skill.lead} {joinWithAnd(keywords)}.
    </li>
  )
}

function Activity({ activity }: { activity: ActivityNode }) {
  const { visible, props } = useItemProps(activity)
  if (!visible) return null

  return (
    <li {...props} data-print-unit={activity.id}>
      <Rich node={activity} />
      {activity.children && (
        <ul class={activity.childrenClass}>
          {activity.children.map((child) => (
            <Rich as="li" key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

const printButton = (
  <>
    <h6 class="self-center italic text-neutral-900 text-xs hidden print:block!">
      View full resume at <a href="/resume/">eligundry.com/resume/</a>
    </h6>
    <button
      class="print-button btn btn-sm btn-ghost sm:tooltip sm:tooltip-primary sm:tooltip-left self-start normal-case print:hidden! sm:inline"
      data-tip="Download this resume by printing it as a PDF"
      aria-label="Download this resume by printing it as a PDF"
      onClick={() => window.print()}
    >
      <FaDownload />
    </button>
  </>
)

export default function ResumeView({
  resume,
  density = 'normal',
  fontScale = 1,
}: {
  resume: ResumeSource
  density?: 'normal' | 'compact'
  fontScale?: number
}) {
  const { basics } = resume

  return (
    <div
      class="paper gap-4 flex flex-col [&_.prose_ul]:list-outside [&_.prose_ul]:pl-1 [&_.prose_ul]:sm:pl-0 [&_.prose_ul_li]:pl-0 [&_.prose_ul_ul]:pl-4 [&_.prose_ul_ul]:my-0 [&_.prose]:print:text-sm"
      data-resume-root
      data-tailor-density={density}
      style={fontScale === 1 ? undefined : { '--tailor-font-scale': fontScale }}
    >
      <header
        class="hidden print:flex flex-row justify-between prose border-b-2 border-b-accent"
        data-print-unit="basics"
      >
        <h1 class="text-lg mb-0">{basics.name}</h1>
        <h2 class="text-sm mt-0 font-mono! self-center">
          <Rich class="text-primary" node={basics.label} />{' '}
          <span class="comment">
            // <Rich class="font-normal" node={basics.tagline} />
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
                header={section.id === 'section:work' && printButton}
              >
                {section.items.map((experience) => (
                  <Experience key={experience.id} experience={experience} />
                ))}
              </Section>
            )
          case 'section:skills':
            return (
              <Section
                key={section.id}
                section={section}
                className="[&>ul]:mt-0"
              >
                <ul>
                  {section.items.map((skill) => (
                    <SkillLine key={skill.id} skill={skill} />
                  ))}
                </ul>
              </Section>
            )
          case 'section:activities':
            return (
              <Section
                key={section.id}
                section={section}
                className="[&>ul]:mt-0"
              >
                <ul>
                  {section.items.map((activity) => (
                    <Activity key={activity.id} activity={activity} />
                  ))}
                </ul>
              </Section>
            )
        }
      })}
    </div>
  )
}
