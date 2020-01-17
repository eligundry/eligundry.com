import React from 'react'

import resumeData from './data'
import Work from './Work'
import Education from './Education'

const Resume: React.FC = () => {
  return (
    <article>
      <Work work={resumeData.work} />
      <Education education={resumeData.education} />
    </article>
  )
}

export default Resume
