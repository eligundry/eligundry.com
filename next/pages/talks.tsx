import type { NextPage, GetStaticProps } from 'next'

import PostListing from '@/components/PostListing'
import blog, { Post } from '@/lib/blog'

const TalksPage: NextPage<{ posts: Post[] }> = (props) => {
  return <PostListing itemType="BlogPosting" posts={props.posts} />
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
