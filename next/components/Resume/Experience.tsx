import React from 'react'
import clsx from 'clsx'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'

import { Location } from './data'
import { useParseOptimizedFlag } from './hooks'
import styles from './index.module.scss'

interface Props {
  variant: 'work' | 'education'
  name: string
  url: string
  startDate: Date
  endDate: Date | null
  position: string
  location: Partial<Location>
  summary: string | null
  highlights: string[]
}

const Experience: React.FC<Props> = ({
  variant,
  name,
  url,
  startDate,
  endDate,
  position,
  location,
  summary,
  highlights,
}) => {
  const parseOptimized = useParseOptimizedFlag()

  return (
    <section
      itemType={`http://schema.org/${
        variant === 'work' ? 'Organization' : 'CollegeOrUniversity'
      }`}
      itemScope
      itemProp={endDate ? 'alumniOf' : 'worksFor'}
      className={clsx(styles.experience)}
    >
      <h3 className={styles.experienceName} itemProp="name">
        <a href={url} itemProp="url">
          {name}
        </a>
      </h3>
      <span
        className={clsx(
          styles.experienceTenure,
          parseOptimized
            ? styles.parseOptimizedExperienceTenure
            : styles.notParseOptimizedExperienceTenure
        )}
        itemScope
        itemType="https://schema.org/OrganizationRole"
        itemProp="member"
      >
        <meta itemProp="roleName" content={position} />
        <time
          itemProp="startDate"
          dateTime={formatISO(startDate, { representation: 'date' })}
        >
          {format(startDate, 'MMMM yyyy')}
        </time>{' '}
        &mdash;{' '}
        <time
          itemProp="endDate"
          dateTime={
            endDate ? formatISO(endDate, { representation: 'date' }) : ''
          }
        >
          {endDate ? format(endDate, 'MMMM yyyy') : 'Present'}
        </time>
      </span>
      <h4 className={styles.experienceTitle}>{position}</h4>
      <address
        itemProp="address"
        itemScope
        itemType="https://schema.org/PostalAddress"
        className={clsx(
          styles.experienceLocation,
          parseOptimized
            ? styles.parseOptimizedExperienceLocation
            : styles.notParseOptimizedExperienceLocation
        )}
      >
        {location.city && (
          <>
            <span itemProp="addressLocality">{location.city}</span>,{' '}
          </>
        )}
        {location.region && (
          <span itemProp="addressRegion">{location.region}</span>
        )}
      </address>
      {summary && (
        <p
          className={styles.experienceSummary}
          itemProp="description"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      )}
      {highlights.length > 0 && (
        <ul className={styles.experienceDescription} itemProp="description">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              dangerouslySetInnerHTML={{ __html: highlight }}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Experience
