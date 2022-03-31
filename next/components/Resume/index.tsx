import React, { useEffect } from 'react'
import tw, { styled, css } from 'twin.macro'

import resumeData from './data'
import Work from './Work'
import Education from './Education'
import Skills from './Skills'
import ActivitiesInterests from './ActivitesInterests'
import PaperArticle from '../Shared/Paper'
import ResumeHeader from './Header'
import ResumeFooter from './Footer'
import { useParseOptimizedFlag } from './hooks'

const ResumeArticle = styled(PaperArticle)<{ parseOptimized?: boolean }>`
  ${tw`print:mb-16 print:text-base print:ml-1`}
  ${(props) => props.parseOptimized && tw`print:font-parseSafeSerif`}

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

    ${(props) => props.parseOptimized && tw`print:font-parseSafeMono`}
  }

  & ul {
    ${tw`m-0 pl-0 list-inside print:list-outside`}

    & ul, ol {
      ${tw`pl-8`}
    }
  }

  ${(props) =>
    props.parseOptimized &&
    css`
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        ${tw`font-parseSafeSans`}
      }

      code {
        ${tw`font-parseSafeMono`}
      }
    `}

  & .hackathons {
    columns: 2;
  }
`

const Resume: React.FC = () => {
  const parseOptimized = useParseOptimizedFlag()

  useEffect(
    () =>
      /* eslint-disable-next-line no-console */
      console.info(`
You can control how this resume prints with the following query parameters on the page.

* parse-optimized: This will set all the fonts and imagery to be super basic so that ATS parsers don't get confused by embedded fonts.
* company / contact-name: Set this to the name of a company or recruiter so that you can track click through rates from emailed resumes.
* full: don't omit any experiences when printing
  `),
    []
  )

  return (
    <ResumeArticle parseOptimized={parseOptimized}>
      <ResumeHeader />
      <Skills skills={resumeData.skills} />
      <Work work={resumeData.work} />
      <Education education={resumeData.education} />
      <ActivitiesInterests activitesInterests={resumeData.activitesInterests} />
      {!parseOptimized && <ResumeFooter />}
    </ResumeArticle>
  )
}

export default Resume
