import type { NextPage, GetStaticProps } from 'next'
import promiseHash from 'promise-hash'

import Home, { HomeDataProps } from '@/components/Home'
import SEO from '@/components/SEO'
import { FullDaylioPageProps } from '@/components/Daylio/Provider'
import goodreadsAPI from '@/lib/goodreads'
import daylioAPI from '@/lib/daylio'
import lastfmAPI from '@/lib/lastfm'
import githubAPI from '@/lib/github'
import config from '@/utils/config'

const HomePage: NextPage<HomeDataProps & FullDaylioPageProps> = ({
  reading,
  lastfmCover,
  github,
}) => (
  <>
    <SEO path="/" />
    <Home reading={reading} lastfmCover={lastfmCover} github={github} />
  </>
)

export const getStaticProps: GetStaticProps<
  HomeDataProps & FullDaylioPageProps
> = async () => ({
  props: await promiseHash({
    reading: promiseHash({
      current: goodreadsAPI.getShelf(
        config.goodreadsUserID,
        'currently-reading',
        1
      ),
      read: goodreadsAPI.getShelf(config.goodreadsUserID, 'read', 11),
    }),
    lastfmCover: lastfmAPI.getTopAlbumsCover('eli_pwnd'),
    github: githubAPI.fetchData('eligundry'),
    daylio: daylioAPI.getHomeProps(),
  }),
})

export default HomePage
