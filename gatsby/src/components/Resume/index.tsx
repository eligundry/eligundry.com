import React from 'react'

import resumeData from './data'
import Work from './Work'
import Education from './Education'
import Skills from './Skills'
import ActivitiesInterests from './ActivitesInterests'

const Resume: React.FC = () => {
  return (
    <article>
      <Work work={resumeData.work} />
      <Education education={resumeData.education} />
      <Skills skills={resumeData.skills} />
      <ActivitiesInterests activitesInterests={resumeData.activitesInterests} />
    </article>
  )
}

export default Resume
