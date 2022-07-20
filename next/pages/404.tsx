import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/future/image'

import SEO from '@/components/SEO'
import Paper from '@/components/Shared/Paper'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'

const ErrorPage: NextPage<LimitedDaylioPageProps> = () => {
  const { asPath } = useRouter()

  return (
    <>
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
    </>
  )
}

export const getStaticProps = daylioAPI.getLimitedPageProps

export default ErrorPage
