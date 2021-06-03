import React from 'react'
import tw, { styled } from 'twin.macro'

interface Props {
  activitesInterests: string[]
}

const ActivitiesInterests: React.FC<Props> = ({ activitesInterests }) => {
  return (
    <section>
      <header>
        <h2>Activities & Interests</h2>
      </header>
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
    ${tw`pl-0 mt-0`}
  }
`

export default ActivitiesInterests
