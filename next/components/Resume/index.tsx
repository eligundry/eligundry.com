import React, { useEffect } from 'react'
import clsx from 'clsx'

import resumeData from './data'
import Work from './Work'
import Education from './Education'
import Skills from './Skills'
import ActivitiesInterests from './ActivitesInterests'
import Paper from '@/components/Shared/Paper'
import ResumeHeader from './Header'
import ResumeFooter from './Footer'
import { useParseOptimizedFlag } from './hooks'
import styles from './index.module.scss'

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
    <Paper
      element="article"
      className={clsx(
        styles.resumeContainer,
        parseOptimized && styles.parseOptimizedResumeContainer
      )}
    >
      <ResumeHeader />
      <Skills skills={resumeData.skills} />
      <Work work={resumeData.work} />
      <Education education={resumeData.education} />
      <ActivitiesInterests activitesInterests={resumeData.activitesInterests} />
      {!parseOptimized && <ResumeFooter />}
    </Paper>
  )
}

export default Resume
