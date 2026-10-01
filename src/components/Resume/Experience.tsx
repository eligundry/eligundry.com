import * as dateFns from 'date-fns'
import type {
  ExperienceNode,
  ExperienceRole,
  TextNode,
} from '../../lib/resume/model'
import { useContext } from 'preact/hooks'
import type { JSX } from 'preact'
import { cx, Rich, ResumeViewContext, useItemProps } from './ResumeView'
import { useBulletDrag } from './useBulletDrag'

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
}: {
  experience: ExperienceNode
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
  const shown = experience.highlights.filter((h) => !h.hidden).map((h) => h.id)
  const drag = useBulletDrag(
    experience.highlights.map((h) => h.id),
    shown,
    edit && ((ids) => edit.moveBullets(id, ids))
  )
  if (!visible) return null

  const endDate = experience.endDate && dateFns.parseISO(experience.endDate)

  const roles = experience.roles?.length ? experience.roles : undefined

  // Only the heading is the organization's microdata, so links in the
  // bullets describe the page's Person (see collectTechnologies).
  return (
    <section {...props} data-print-unit={id}>
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
      {experience.summary && <SummaryParagraph summary={experience.summary} />}
      {experience.highlights.length > 0 && (
        <ul class="order-5 w-full my-0">
          {experience.highlights.map((highlight) => (
            <Bullet
              key={highlight.id}
              bullet={highlight}
              handle={drag.handleProps(highlight.id)}
              dragging={drag.dragging === highlight.id}
              dropBefore={drag.drop === highlight.id}
              dropAfter={
                drag.drop === 'end' && highlight.id === shown[shown.length - 1]
              }
            />
          ))}
        </ul>
      )}
      {edit && (
        <button
          type="button"
          class="tailor-add order-5 print:hidden"
          onClick={() => edit.addBullet(id)}
        >
          + Add bullet
        </button>
      )}
    </section>
  )
}

function Bullet({
  bullet,
  handle,
  dragging,
  dropBefore,
  dropAfter,
}: {
  bullet: TextNode
  /** Props for the marker that drags the bullet, in edit mode. */
  handle: JSX.HTMLAttributes<HTMLButtonElement>
  dragging: boolean
  dropBefore: boolean
  dropAfter: boolean
}) {
  const { visible, props } = useItemProps(bullet)
  const { edit } = useContext(ResumeViewContext)
  if (!visible) return null
  if (!edit || bullet.hidden) return <Rich as="li" {...props} node={bullet} />

  // The list marker becomes a handle: CSS markers can't be dragged, so it's
  // drawn by a button in the same place.
  return (
    <li
      {...props}
      class={cx(props.class, 'tailor-bullet')}
      data-dragging={dragging || undefined}
      data-drop-before={dropBefore || undefined}
      data-drop-after={dropAfter || undefined}
    >
      <button
        type="button"
        class="tailor-handle print:hidden"
        aria-label="Move bullet"
        title="Drag to reorder (or use the arrow keys)"
        {...handle}
      />
      <Rich node={bullet} />
      <button
        type="button"
        class="tailor-remove print:hidden"
        aria-label="Remove bullet"
        title="Remove bullet"
        onClick={() => edit.removeBullet(bullet.id)}
      >
        ×
      </button>
    </li>
  )
}

function SummaryParagraph({ summary }: { summary: TextNode }) {
  const { visible, props } = useItemProps(summary, 'order-5 w-full my-2')
  return visible ? <Rich as="p" {...props} node={summary} /> : null
}
