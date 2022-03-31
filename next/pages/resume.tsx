import type { NextPage } from 'next'

import Resume from '@/components/Resume'
import SEO from '@/components/SEO'
import DaylioProvider from '@/components/Daylio/Provider'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'

// @TODO Gotta hide the header when I'm printing?

const ResumePage: NextPage<LimitedDaylioPageProps> = ({ daylio }) => (
  <DaylioProvider {...daylio}>
    <SEO
      title="Resume"
      description="My resume in HTML form. Dang, I have worked at a lot of places, so many accomplishments. What a storied career I've had."
      path="/resume"
    />
    <Resume />
  </DaylioProvider>
)

export const getStaticProps = daylioAPI.getLimitedPageProps

export default ResumePage
