import type { NextPage, GetStaticProps } from 'next'
import subMonths from 'date-fns/subMonths'

import Home, { HomeDataProps } from '@/components/Home'
import SEO from '@/components/SEO'
import goodreads from '@/lib/goodreads'
import daylio from '@/lib/daylio'
import lastfm from '@/lib/lastfm'

const HomePage: NextPage<HomeDataProps> = ({
  reading,
  lastfmCover,
  daylioChartData,
}) => {
  return (
    <>
      <SEO path="/" />
      <Home
        reading={reading}
        lastfmCover={lastfmCover}
        daylioChartData={daylioChartData}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeDataProps> = async () => {
  const daylioChartData = await daylio.getChartData(subMonths(new Date(), 1))
  const lastfmCover = await lastfm.getTopAlbumsCover('eli_pwnd')
  const reading = {
    current: await goodreads.getShelf('29665939', 'currently-reading', 1),
    read: await goodreads.getShelf('29665939', 'read', 11),
  }

  return {
    props: {
      reading,
      lastfmCover,
      daylioChartData,
    },
  }
}

export default HomePage
