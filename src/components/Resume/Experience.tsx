import * as dateFns from 'date-fns'
import type {
  ExperienceNode,
  ExperienceRole,
  TextNode,
} from '../../lib/resume/model'
import { cx, Rich, useItemProps } from './ResumeView'

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
        <ul class="order-5 my-0">
          {experience.highlights.map((highlight) => (
            <Bullet key={highlight.id} bullet={highlight} />
          ))}
        </ul>
      )}
    </section>
  )
}

function Bullet({ bullet }: { bullet: TextNode }) {
  const { visible, props } = useItemProps(bullet)
  return visible ? <Rich as="li" {...props} node={bullet} /> : null
}

function SummaryParagraph({ summary }: { summary: TextNode }) {
  const { visible, props } = useItemProps(summary, 'order-5 my-2')
  return visible ? <Rich as="p" {...props} node={summary} /> : null
}
