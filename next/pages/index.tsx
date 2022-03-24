import type { NextPage, GetStaticProps } from 'next'

import Home, { HomeDataProps } from '@/components/Home'
import SEO from '@/components/SEO'
import goodreads from '@/lib/goodreads'
import daylio from '@/lib/daylio'

const HomePage: NextPage<HomeDataProps> = ({ reading }) => {
  return (
    <>
      <SEO path="/" />
      <Home reading={reading} />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeDataProps> = async () => {
  const reading = {
    current: await goodreads.getShelf('29665939', 'currently-reading', 1),
    read: await goodreads.getShelf('29665939', 'read', 11),
  }

  return {
    props: {
      reading,
    },
  }
}

export default HomePage
