import React from 'react'

import resumeData from './data'
import Work from './Work'

const Resume: React.FC = () => {
  return (
    <article>
      <Work work={resumeData.work} />
    </article>
  )
}

export default Resume
