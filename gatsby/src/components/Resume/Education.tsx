import React from 'react'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'

import { Education } from './data'

interface EducationItemProps {
  education: Education
}

const EducationItem: React.FC<EducationItemProps> = ({ education }) => {
  return (
    <div
      itemType="http://schema.org/Organization"
      itemScope
      itemProp="alumniOf"
    >
      <h3 itemProp="name">
        {education.institution}
        {/* <a href={education.website} itemProp="url"> */}
        {/*   {education.company} */}
        {/* </a> */}
      </h3>
      <span className="tenure">
        <time
          itemProp="foundingDate"
          dateTime={formatISO(education.startDate, { representation: 'date' })}
        >
          {format(education.startDate, 'MMMM yyyy')}
        </time>
        &mdash;
        <time
          itemProp="dissolutionDate"
          dateTime={
            education.endDate
              ? formatISO(education.endDate, { representation: 'date' })
              : ''
          }
        >
          {education.endDate
            ? format(education.endDate, 'MMMM yyyy')
            : 'Present'}
        </time>
      </span>
      <h4>
        <span itemProp="award">
          {[education.studyType, education.area].filter(i => !!i).join(' - ')}
        </span>
        <address
          itemProp="address"
          itemScope
          itemType="http://schema.org/PostalAddress"
        >
          {education.location.city && (
            <>
              <span itemProp="addressLocality">{education.location.city}</span>,{' '}
            </>
          )}
          {education.location.region && (
            <span itemProp="addressRegion">{education.location.region}</span>
          )}
        </address>
      </h4>
      {education.summary && (
        <p
          itemProp="summary"
          dangerouslySetInnerHTML={{ __html: education.summary }}
        />
      )}
    </div>
  )
}

interface EducationProps {
  education: Education[]
}

const EducationSection: React.FC<EducationProps> = ({ education }) => {
  return (
    <section>
      <h2>Education</h2>
      {education.map(e => (
        <EducationItem education={e} />
      ))}
    </section>
  )
}

export default EducationSection
