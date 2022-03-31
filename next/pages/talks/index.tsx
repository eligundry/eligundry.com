import type { NextPage, GetStaticProps } from 'next'
import promiseHash from 'promise-hash'

import PostListing from '@/components/PostListing'
import Paper from '@/components/Shared/Paper'
import SEO from '@/components/SEO'
import DaylioProvider from '@/components/Daylio/Provider'
import blog, { Post } from '@/lib/blog'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'

interface PageProps extends LimitedDaylioPageProps {
  posts: Post[]
}

const TalksPage: NextPage<PageProps> = ({ posts, daylio }) => (
  <DaylioProvider {...daylio}>
    <SEO
      title="Talks"
      description="Talks that I have given at meetups and conferences."
      path="/talks"
    />
    <Paper className="listing-container">
      <PostListing itemType="CreativeWork" posts={posts} />
    </Paper>
  </DaylioProvider>
)

export const getStaticProps: GetStaticProps<PageProps> = async () => ({
  props: await promiseHash({
    posts: blog.getAll('talks', ['title', 'path', 'date', 'description']),
    daylio: daylioAPI.getLimitedProps().then((r) => r.daylio),
  }),
})

export default TalksPage
