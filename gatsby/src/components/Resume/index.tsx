import React from 'react'

import resumeData from './data'
import Work from './Work'
import Education from './Education'
import Skills from './Skills'
import ActivitiesInterests from './ActivitesInterests'
import PaperArticle from '../Shared/Paper'

const Resume: React.FC = () => {
  return (
    <PaperArticle itemScope itemType="https://schema.org/Person">
      <meta itemProp="name" content={resumeData.basics.name} />
      <meta itemProp="telephone" content={resumeData.basics.phone} />
      <meta itemProp="email" content={resumeData.basics.email} />
      <Work work={resumeData.work} />
      <Education education={resumeData.education} />
      <Skills skills={resumeData.skills} />
      <ActivitiesInterests activitesInterests={resumeData.activitesInterests} />
    </PaperArticle>
  )
}

export default Resume
