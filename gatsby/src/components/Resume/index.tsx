import React from 'react'
import tw, { styled } from 'twin.macro'

import resumeData from './data'
import Work from './Work'
import Education from './Education'
import Skills from './Skills'
import ActivitiesInterests from './ActivitesInterests'
import PaperArticle from '../Shared/Paper'

const ResumeArticle = styled(PaperArticle)`
  & h2 {
    ${tw`font-extrabold`}
  }

  & header {
    ${tw`border-b-2 mb-2 flex flex-row justify-between`}

    & svg {
      ${tw`inline align-text-top`}
      margin-top: 3px;
    }
  }

  & section section {
    page-break-inside: avoid;
  }
`

const Resume: React.FC = () => {
  return (
    <ResumeArticle>
      <Work work={resumeData.work} />
      <Education education={resumeData.education} />
      <Skills skills={resumeData.skills} />
      <ActivitiesInterests activitesInterests={resumeData.activitesInterests} />
    </ResumeArticle>
  )
}

export default Resume
