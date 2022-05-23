import type { NextPage, GetStaticProps } from 'next'
import promiseHash from 'promise-hash'

import PostListing, { PostListingProps } from '@/components/PostListing'
import Paper from '@/components/Shared/Paper'
import SEO from '@/components/SEO'
import blog from '@/lib/blog'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'

interface PageProps extends LimitedDaylioPageProps {
  posts: PostListingProps['posts']
}

const TalksPage: NextPage<PageProps> = ({ posts }) => (
  <>
    <SEO
      title="Talks"
      description="Talks that I have given at meetups and conferences."
      path="/talks"
    />
    <Paper className="listing-container">
      <PostListing itemType="CreativeWork" posts={posts} />
    </Paper>
  </>
)

export const getStaticProps: GetStaticProps<PageProps> = async () => ({
  props: await promiseHash({
    posts: blog.getAll('talks', [
      'title',
      'path',
      'date',
      'description',
      'cover',
      'modified',
      'readingTime',
    ]),
    daylio: daylioAPI.getLimitedProps().then((r) => r.daylio),
  }),
})

export default TalksPage
