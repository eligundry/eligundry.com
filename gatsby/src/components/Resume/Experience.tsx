import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'

import { Location } from './data'

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

const StyledExperience = styled.div`
  display: flex;
  flex-flow: wrap;

  & .name,
  & .tenure,
  & .title,
  & .location {
    width: 50%;
    margin: 0;
  }

  .tenure,
  .location {
    text-align: right;
  }

  & .description {
    padding-left: 0;
  }
`

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
  return (
    <StyledExperience
      itemType="http://schema.org/Organization"
      itemScope
      itemProp="alumniOf"
    >
      <h3 className="name" itemProp="name">
        <a href={url} itemProp="url">
          {name}
        </a>
      </h3>
      <span className="tenure">
        <time
          itemProp="foundingDate"
          dateTime={formatISO(startDate, { representation: 'date' })}
        >
          {format(startDate, 'MMMM yyyy')}
        </time>{' '}
        &mdash;{' '}
        <time
          itemProp="dissolutionDate"
          dateTime={
            endDate ? formatISO(endDate, { representation: 'date' }) : ''
          }
        >
          {endDate ? format(endDate, 'MMMM yyyy') : 'Present'}
        </time>
      </span>
      <h4
        className="title"
        itemProp={variant === 'work' ? 'jobTitle' : 'award'}
      >
        {position}
      </h4>
      <address
        itemProp="address"
        itemScope
        itemType="http://schema.org/PostalAddress"
        className="location"
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
          className="summary"
          itemProp="summary"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      )}
      {highlights.length > 0 && (
        <ul className="description" itemProp="description">
          {highlights.map(highlight => (
            <li
              key={highlight}
              dangerouslySetInnerHTML={{ __html: highlight }}
            />
          ))}
        </ul>
      )}
    </StyledExperience>
  )
}

export default Experience
