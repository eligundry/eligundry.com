import React from 'react'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'

import { Work } from './data'

interface WorkItemProps {
  work: Work
}

const WorkItem: React.FC<WorkItemProps> = ({ work }) => {
  return (
    <div
      itemType="http://schema.org/Organization"
      itemScope
      itemProp="alumniOf"
    >
      <h3 itemProp="name">
        <a href={work.website} itemProp="url">
          {work.company}
        </a>
      </h3>
      <span className="tenure">
        <time
          itemProp="foundingDate"
          dateTime={formatISO(work.startDate, { representation: 'date' })}
        >
          {format(work.startDate, 'MMMM yyyy')}
        </time>
        &mdash;
        <time
          itemProp="dissolutionDate"
          dateTime={
            work.endDate
              ? formatISO(work.endDate, { representation: 'date' })
              : ''
          }
        >
          {work.endDate ? format(work.endDate, 'MMMM yyyy') : 'Present'}
        </time>
      </span>
      <h4>
        <span itemProp="jobTitle">{work.position}</span>
        <address
          itemProp="address"
          itemScope
          itemType="http://schema.org/PostalAddress"
        >
          {work.location.city && (
            <>
              <span itemProp="addressLocality">{work.location.city}</span>,{' '}
            </>
          )}
          {work.location.region && (
            <span itemProp="addressRegion">{work.location.region}</span>
          )}
        </address>
      </h4>
      {work.summary && <p itemProp="summary">{work.summary}</p>}
      {work.highlights.length > 0 && (
        <ul itemProp="description">
          {work.highlights.map(highlight => (
            <li>{highlight}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface WorkProps {
  work: Work[]
}

const WorkSection: React.FC<WorkProps> = ({ work }) => {
  return (
    <section>
      <h2>Work</h2>
      {work.map(w => (
        <WorkItem work={w} />
      ))}
    </section>
  )
}

export default WorkSection
