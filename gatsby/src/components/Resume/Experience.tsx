import React from 'react'
import tw, { styled, theme } from 'twin.macro'
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

const StyledExperience = styled.section`
  ${tw`flex flex-wrap justify-between mb-4`}

  & .name,
  & .tenure,
  & .title,
  & .location {
    ${tw`w-1/2 print:w-1/2 sm:w-full xs:w-full m-0`}
    line-height: 1.25em;
  }

  & .name {
    ${tw`order-1`}
    ${tw`font-bold text-xl`}
  }

  & .title {
    ${tw`order-3 print:order-3 xs:order-2 sm:order-2`}
    ${tw`font-semibold font-sans text-base`}
  }

  & .tenure {
    ${tw`order-2 print:order-2 xs:order-3 sm:order-3`}
  }

  & .location {
    ${tw`not-italic print:order-4 order-4`}
  }

  & .tenure, & .location {
    ${tw`text-sm font-mono`}
    letter-spacing: -0.6px;
    margin-top: 4px;
  }

  @media (min-width: ${theme`screens.md`}) {
    & .location:after {
      content: '📍';
      ${tw`ml-1`}
    }

    & .tenure:after {
      content: '🗓';
      ${tw`ml-1`}
    }
  }

  @media (max-width: ${theme`screens.md`}) and not print {
    & .location:before {
      content: '📍';
      ${tw`mr-2`}
    }

    & .tenure:before {
      content: '🗓';
      ${tw`mr-2`}
    }
    }
  }

  @media print {
    & .location:after {
      content: '📍';
      ${tw`ml-1`}
    }

    & .tenure:after {
      content: '🗓';
      ${tw`ml-1`}
    }
  }

  & .description,
  & .summary {
    margin: 0;
    ${tw`order-5`}
  }

  & .tenure,
  & .location {
    ${tw`text-right print:text-right sm:text-left xs:text-left`}
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
}) => (
  <StyledExperience
    itemType={`http://schema.org/${
      variant === 'work' ? 'Organization' : 'CollegeOrUniversity'
    }`}
    itemScope
    itemProp={endDate ? 'alumniOf' : 'worksFor'}
  >
    <h3 className="name" itemProp="name">
      <a href={url} itemProp="url">
        {name}
      </a>
    </h3>
    <span
      className="tenure"
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
        dateTime={endDate ? formatISO(endDate, { representation: 'date' }) : ''}
      >
        {endDate ? format(endDate, 'MMMM yyyy') : 'Present'}
      </time>
    </span>
    <h4 className="title">{position}</h4>
    <address
      itemProp="address"
      itemScope
      itemType="https://schema.org/PostalAddress"
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
        itemProp="description"
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    )}
    {highlights.length > 0 && (
      <ul className="description" itemProp="description">
        {highlights.map((highlight) => (
          <li key={highlight} dangerouslySetInnerHTML={{ __html: highlight }} />
        ))}
      </ul>
    )}
  </StyledExperience>
)

export default Experience
