import React from 'react'
import tw, { styled } from 'twin.macro'

import resumeData from './data'
import Work from './Work'
import Education from './Education'
import Skills from './Skills'
import ActivitiesInterests from './ActivitesInterests'
import PaperArticle from '../Shared/Paper'
import ResumeHeader from './Header'
import ResumeFooter from './Footer'

const ResumeArticle = styled(PaperArticle)`
  ${tw`print:mb-16 print:text-base print:ml-1`}

  & h2 {
    ${tw`font-extrabold text-xl`}
  }

  & header {
    ${tw`border-b-2 mb-2 flex flex-row justify-between`}

    & svg {
      ${tw`inline align-text-top`}
      margin-top: 3px;
    }
  }

  & .full-work-cta {
    ${tw`font-mono text-xs`}
    letter-spacing: -0.6px;
    margin-top: 9px;
  }

  & section {
    page-break-inside: avoid;
  }
`

const Resume: React.FC = () => {
  return (
    <ResumeArticle>
      <ResumeHeader />
      <Work work={resumeData.work} />
      <Education education={resumeData.education} />
      <Skills skills={resumeData.skills} />
      <ActivitiesInterests activitesInterests={resumeData.activitesInterests} />
      <ResumeFooter />
    </ResumeArticle>
  )
}

export default Resume
