import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'

import styles from '../../../data/styleConfig'
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
  margin-bottom: 1em;

  & .name,
  & .tenure,
  & .title,
  & .location {
    width: 60%;
    margin: 0;
    line-height: 1.25em;
  }

  & .location {
    font-style: normal;
  }

  & .location:after {
    content: '📍';
  }

  & .tenure:after {
    content: '🗓';
  }

  & .tenure,
  & .location {
    text-align: right;
    width: 40%;

    &:after {
      margin-left: 0.25em;
    }
  }

  & .description {
    padding-left: 0;
  }

  & .description,
  & .summary {
    margin: 0;
  }

  @media (${styles.breakPoints.tablet}) {
    & .name,
    & .tenure,
    & .title,
    & .location {
      text-align: left;
      width: 100%;
    }

    & .name {
      order: 1;
    }

    & .title {
      order: 2;
    }

    & .tenure {
      order: 3;
    }

    & .location {
      order: 4;
    }

    & .summary {
      order: 5;
    }

    & .description {
      order: 6;
    }

    & .tenure,
    & .location {
      &:after {
        float: left;
        margin-left: 0;
      }
    }
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
