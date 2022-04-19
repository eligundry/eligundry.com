import type { NextPage } from 'next'

import Resume from '@/components/Resume'
import SEO from '@/components/SEO'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'

// @TODO Gotta hide the header when I'm printing?

const ResumePage: NextPage<LimitedDaylioPageProps> = () => (
  <>
    <SEO
      title="Resume"
      description="My resume in HTML form. Dang, I have worked at a lot of places, so many accomplishments. What a storied career I've had."
      path="/resume"
    />
    <Resume />
  </>
)

export const getStaticProps = daylioAPI.getLimitedPageProps

export default ResumePage
