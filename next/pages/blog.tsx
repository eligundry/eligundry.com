import type { NextPage, GetStaticProps } from 'next'

import PostListing from '@/components/PostListing'
import blog, { Post } from '@/lib/blog'
import daylio from '@/lib/daylio'

const Blog: NextPage<{ posts: Post[] }> = (props) => {
  return <PostListing itemType="BlogPosting" posts={props.posts} />
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await blog.getAll('blog', [
    'title',
    'path',
    'date',
    'description',
    'tags',
  ])
  const latestFeeling = await daylio.getLatest()

  return {
    props: {
      latestFeeling,
      posts,
    },
  }
}

export default Blog
