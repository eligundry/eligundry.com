import React from 'react'

import Experience from './Experience'
import { Education } from './data'

interface EducationProps {
  education: Education[]
}

const EducationSection: React.FC<EducationProps> = ({ education }) => (
    <section>
      <header>
        <h2>Education</h2>
      </header>
      {education.map(e => (
        <Experience
          key={e.institution}
          variant="education"
          name={e.institution}
          url={e.website}
          startDate={e.startDate}
          endDate={e.endDate}
          position={[e.studyType, e.area].filter(i => !!i).join(' - ')}
          location={e.location}
          summary={e.summary}
          highlights={[]}
        />
      ))}
    </section>
  )

export default EducationSection
