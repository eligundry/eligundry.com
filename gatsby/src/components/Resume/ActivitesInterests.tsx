import React from 'react'

interface Props {
  activitesInterests: string[]
}

const ActivitiesInterests: React.FC<Props> = ({ activitesInterests }) => {
  return (
    <section>
      <h2>Activities & Interests</h2>
      <ul>
        {activitesInterests.map(ai => (
          <li key={ai} dangerouslySetInnerHTML={{ __html: ai }} />
        ))}
      </ul>
    </section>
  )
}

export default ActivitiesInterests
