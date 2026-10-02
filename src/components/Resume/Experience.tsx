import * as dateFns from 'date-fns'
import type {
  ExperienceNode,
  ExperienceRole,
  TextNode,
} from '../../lib/resume/model'
import { useContext } from 'preact/hooks'
import type { JSX } from 'preact'
import { FaPrint } from 'react-icons/fa'
import EditableList from './EditableList'
import { cx, Rich, ResumeViewContext, useItemProps } from './ResumeView'

function Time({ date, itemProp }: { date: Date; itemProp: string }) {
  return (
    <time
      itemProp={itemProp}
      dateTime={dateFns.formatISO(date, { representation: 'date' })}
    >
      {dateFns.format(date, 'MMMM yyyy')}
    </time>
  )
}

function Tenure({
  role,
  endDate,
}: {
  role: Pick<ExperienceRole, 'startDate'>
  endDate?: Date
}) {
  return (
    <>
      <Time date={dateFns.parseISO(role.startDate)} itemProp="startDate" />{' '}
      &mdash;{' '}
      {endDate ? (
        <Time date={endDate} itemProp="endDate" />
      ) : (
        <span>Present</span>
      )}
    </>
  )
}

const calendar = (className: string) => (
  <span role="img" aria-label="calendar denoting tenure" class={className}>
    🗓
  </span>
)

/** Each title held at a job with a promotion, newest first. */
function Roles({ roles }: { roles: ExperienceRole[] }) {
  return (
    <div class="w-full order-3 flex flex-col">
      {roles.map((role) => (
        <div
          key={role.startDate}
          itemScope
          itemType="https://schema.org/OrganizationRole"
          itemProp="member"
          class="flex flex-wrap justify-between"
        >
          <h4 itemProp="roleName" class="w-full sm:w-1/2 print:w-1/2 m-0">
            {role.title}
          </h4>
          <span class="w-full sm:w-1/2 print:w-1/2 m-0 sm:text-right print:text-right text-xs font-mono self-center">
            {calendar('sm:hidden')}{' '}
            <Tenure
              role={role}
              endDate={
                role.endDate ? dateFns.parseISO(role.endDate) : undefined
              }
            />{' '}
            {calendar('hidden sm:inline')}
          </span>
        </div>
      ))}
    </div>
  )
}

/** A job or school, with its dates, location, summary and bullets. */
export default function Experience({
  experience,
  drag,
}: {
  experience: ExperienceNode
  /** In edit mode, how this job is dragged within its section. */
  drag?: {
    handle: JSX.HTMLAttributes<HTMLButtonElement>
    dragging: boolean
    dropBefore: boolean
    dropAfter: boolean
  }
}) {
  const { id, type, organization, position, location, url, printHide } =
    experience
  const { visible, props } = useItemProps(
    experience,
    cx(
      'flex flex-wrap justify-between page-break-avoid',
      printHide && 'print:hidden'
    )
  )
  const { edit } = useContext(ResumeViewContext)
  if (!visible) return null
  const draggable = edit && drag && !experience.hidden

  const endDate = experience.endDate && dateFns.parseISO(experience.endDate)

  const roles = experience.roles?.length ? experience.roles : undefined

  // Only the heading is the organization's microdata, so links in the
  // bullets describe the page's Person (see collectTechnologies).
  return (
    <section
      {...props}
      class={cx(props.class, draggable && 'tailor-bullet')}
      data-print-unit={id}
      data-drag-item={draggable || undefined}
      data-dragging={(draggable && drag.dragging) || undefined}
      data-drop-before={(draggable && drag.dropBefore) || undefined}
      data-drop-after={(draggable && drag.dropAfter) || undefined}
    >
      {draggable && (
        <button
          type="button"
          class="tailor-handle tailor-handle-grip print:hidden"
          aria-label={`Move ${organization}`}
          title="Drag to reorder (or use the arrow keys)"
          {...drag.handle}
        />
      )}
      <div
        class="contents"
        itemScope
        itemType={`http://schema.org/${
          type == 'work' ? 'Organization' : 'CollegeOrUniversity'
        }`}
        itemProp={endDate ? 'alumniOf' : 'worksFor'}
      >
        <h3
          itemProp="name"
          class="w-full sm:w-1/2 print:w-1/2 m-0 text-base order-1"
        >
          <a href={url} itemProp="url">
            {organization}
          </a>
        </h3>
        {roles ? (
          <Roles roles={roles} />
        ) : (
          <>
            <span
              itemScope
              itemType="https://schema.org/OrganizationRole"
              itemProp="member"
              class="w-full sm:w-1/2 print:w-1/2 m-0 order-3 sm:order-2 print:order-2 sm:text-right print:text-right text-xs font-mono self-center"
            >
              <meta itemProp="roleName" content={position} />
              {calendar('sm:hidden')}{' '}
              <Tenure role={experience} endDate={endDate || undefined} />{' '}
              {calendar('hidden sm:inline')}
            </span>
            <h4 class="w-full sm:w-1/2 print:w-1/2 m-0 order-2 print:order-3 sm:order-3">
              {position}
            </h4>
          </>
        )}
        <address
          itemScope
          itemProp="address"
          itemType="https://schema.org/PostalAddress"
          class={cx(
            'w-full sm:w-1/2 print:w-1/2 m-0 not-italic sm:text-right print:text-right text-xs font-mono self-center',
            roles ? 'order-2' : 'order-4 print:order-4'
          )}
        >
          <span
            role="img"
            aria-label="pin denoting location on map"
            class="sm:hidden"
          >
            📍
          </span>{' '}
          {location.city && (
            <>
              <span itemProp="addressLocality">{location.city}</span>,{' '}
            </>
          )}
          <span itemProp="addressRegion">{location.region}</span>{' '}
          <span
            role="img"
            aria-label="pin denoting location on map"
            class="hidden sm:inline"
          >
            📍
          </span>
        </address>
      </div>
      {edit && (
        <button
          type="button"
          class={cx(
            'tailor-print-toggle order-5 print:hidden',
            printHide && 'tailor-print-off'
          )}
          aria-pressed={!printHide}
          title={
            printHide
              ? 'Left off the printed resume. Click to print it.'
              : 'On the printed resume. Click to leave it off.'
          }
          onClick={() => edit.setPrinted(id, Boolean(printHide))}
        >
          <FaPrint aria-hidden /> {printHide ? 'Not printed' : 'Printed'}
        </button>
      )}
      {experience.summary && <SummaryParagraph summary={experience.summary} />}
      <EditableList
        parentId={id}
        items={experience.highlights}
        class="order-5 w-full my-0"
        addLabel="Add bullet"
        renderItem={(bullet) => <Rich node={bullet} />}
      />
    </section>
  )
}

function SummaryParagraph({ summary }: { summary: TextNode }) {
  const { visible, props } = useItemProps(
    summary,
    'order-5 w-full my-2 print:my-1'
  )
  return visible ? <Rich as="p" {...props} node={summary} /> : null
}
