import type { NextPage, GetStaticProps } from 'next'

import PostListing from '@/components/PostListing'
import Paper from '@/components/Shared/Paper'
import SEO from '@/components/SEO'
import blog, { Post } from '@/lib/blog'

const TalksPage: NextPage<{ posts: Post[] }> = (props) => {
  return (
    <>
      <SEO
        title="Talks"
        description="Talks that I have given at meetups and conferences."
        path="/talks"
      />
      <Paper className="listing-container">
        <PostListing itemType="CreativeWork" posts={props.posts} />
      </Paper>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
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
    },
  }
}

export default TalksPage
