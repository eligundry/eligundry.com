import React from 'react'

interface Props {
  activitesInterests: string[]
}

const ActivitiesInterests: React.FC<Props> = ({ activitesInterests }) => (
    <section>
      <header>
        <h2>Activities & Interests</h2>
      </header>
      <ul>
        {activitesInterests.map(ai => (
          <li key={ai} dangerouslySetInnerHTML={{ __html: ai }} />
        ))}
      </ul>
    </section>
  )

export default ActivitiesInterests
