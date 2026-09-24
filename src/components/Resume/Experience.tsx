import * as dateFns from 'date-fns'
import { Fragment } from 'preact'
import type {
  ExperienceNode,
  ExperienceRole,
  TextNode,
} from '../../lib/resume/model'
import { cx, Rich, useItemProps } from './ResumeView'

function Time({
  date,
  itemProp,
  format = 'MMMM yyyy',
}: {
  date: Date
  itemProp?: string
  format?: string
}) {
  return (
    <time
      itemProp={itemProp}
      dateTime={dateFns.formatISO(date, { representation: 'date' })}
    >
      {dateFns.format(date, format)}
    </time>
  )
}

/** Each title held, newest first, with its dates in superscript. */
function Roles({ roles }: { roles: ExperienceRole[] }) {
  return roles.map((role, i) => (
    <Fragment key={role.startDate}>
      {i > 0 && ', '}
      <span class="whitespace-nowrap">
        {role.position}
        <sup class="ml-0.5 font-mono font-normal">
          <Time date={dateFns.parseISO(role.startDate)} format="MMM yyyy" />
          &ndash;
          {role.endDate ? (
            <Time date={dateFns.parseISO(role.endDate)} format="MMM yyyy" />
          ) : (
            'Present'
          )}
        </sup>
      </span>
    </Fragment>
  ))
}

/** A job or school, with its dates, location, summary and bullets. */
export default function Experience({
  experience,
}: {
  experience: ExperienceNode
}) {
  const { id, type, organization, position, roles, location, url, printHide } =
    experience
  const { visible, props } = useItemProps(
    experience,
    cx(
      'flex flex-wrap justify-between page-break-avoid',
      printHide && 'print:hidden'
    )
  )
  if (!visible) return null

  const startDate = dateFns.parseISO(experience.startDate)
  const endDate = experience.endDate && dateFns.parseISO(experience.endDate)

  return (
    <section
      {...props}
      itemScope
      itemType={`http://schema.org/${
        type == 'work' ? 'Organization' : 'CollegeOrUniversity'
      }`}
      itemProp={endDate ? 'alumniOf' : 'worksFor'}
      data-print-unit={id}
    >
      <h3
        itemProp="name"
        class="w-full sm:w-1/2 print:w-1/2 m-0 text-base order-1"
      >
        <a href={url} itemProp="url">
          {organization}
        </a>
      </h3>
      <span
        itemScope
        itemType="https://schema.org/OrganizationRole"
        itemProp="member"
        class="w-full sm:w-1/2 print:w-1/2 m-0 order-3 sm:order-2 print:order-2 sm:text-right print:text-right text-xs font-mono self-center"
      >
        <meta itemProp="roleName" content={position} />
        <span
          role="img"
          aria-label="calendar denoting tenure"
          class="sm:hidden"
        >
          🗓
        </span>{' '}
        <Time date={startDate} itemProp="startDate" /> &mdash;{' '}
        {endDate ? (
          <Time date={endDate} itemProp="endDate" />
        ) : (
          <span>Present</span>
        )}{' '}
        <span
          role="img"
          aria-label="calendar denoting tenure"
          class="hidden sm:inline"
        >
          🗓
        </span>
      </span>
      <h4 class="w-full sm:w-1/2 print:w-1/2 m-0 order-2 print:order-3 sm:order-3">
        {roles ? <Roles roles={roles} /> : position}
      </h4>
      <address
        itemScope
        itemProp="address"
        itemType="https://schema.org/PostalAddress"
        class="w-full sm:w-1/2 print:w-1/2 m-0 order-4 print:order-4 not-italic sm:text-right print:text-right text-xs font-mono self-center"
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
      {experience.summary && <SummaryParagraph summary={experience.summary} />}
      {experience.highlights.length > 0 && (
        <ul itemProp="description" class="order-5 my-0">
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
  return visible ? (
    <Rich as="p" {...props} itemProp="description" node={summary} />
  ) : null
}
