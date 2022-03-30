import type { NextPage, GetStaticProps } from 'next'

import PostListing from '@/components/PostListing'
import Paper from '@/components/Shared/Paper'
import SEO from '@/components/SEO'
import DaylioProvider from '@/components/Daylio/Provider'
import blog, { Post } from '@/lib/blog'
import daylio, { LimitedDaylioPageProps } from '@/lib/daylio'

interface PageProps extends LimitedDaylioPageProps {
  posts: Post[]
}

const TalksPage: NextPage<PageProps> = ({ posts, daylio }) => {
  return (
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
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const posts = await blog.getAll('talks', [
    'title',
    'path',
    'date',
    'description',
    'tags',
  ])

  return {
    props: {
      posts,
      ...(await daylio.getLimitedProps()),
    },
  }
}

export default TalksPage
