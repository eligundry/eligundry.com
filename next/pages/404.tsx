import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

import SEO from '@/components/SEO'
import Paper from '@/components/Shared/Paper'
import daylio, { LimitedDaylioPageProps } from '@/lib/daylio'
import DaylioProvider from '@/components/Daylio/Provider'

const ErrorPage: NextPage<LimitedDaylioPageProps> = ({ daylio }) => {
  const { asPath } = useRouter()

  return (
    <DaylioProvider {...daylio}>
      <SEO path={asPath} title="Whoops!" />
      <Paper>
        <h1>Whoops!</h1>
        <p>
          We couldn't find a page called <code>{asPath}</code>!
        </p>
        <Image
          src="https://http.cat/404.jpg"
          alt="HTTP Status Cat for 404 status code"
          width={750}
          height={600}
        />
      </Paper>
    </DaylioProvider>
  )
}

export const getStaticProps = daylio.getLimitedPageProps

export default ErrorPage
