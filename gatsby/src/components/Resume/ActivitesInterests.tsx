import React from 'react'
import tw, { styled, theme } from 'twin.macro'

interface Props {
  activitesInterests: string[]
}

const ActivitiesInterests: React.FC<Props> = ({ activitesInterests }) => {
  return (
    <section>
      <h2>Activities & Interests</h2>
      <ActivitiesList>
        {activitesInterests.map(ai => (
          <li key={ai} dangerouslySetInnerHTML={{ __html: ai }} />
        ))}
      </ActivitiesList>
    </section>
  )
}

const ActivitiesList = styled.ul`
  && {
    ${tw`pl-0`}
  }
`

export default ActivitiesInterests
