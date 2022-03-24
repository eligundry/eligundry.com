import type { NextPage, GetStaticProps } from 'next'

import PostListing from '@/components/PostListing'
import SEO from '@/components/SEO'
import blog, { Post } from '@/lib/blog'
import daylio from '@/lib/daylio'

const Blog: NextPage<{ posts: Post[] }> = (props) => {
  return (
    <>
      <SEO
        title="Blog"
        description="Thoughts, tutorials, musings, album reviews and everything in between that I have written down."
        path="/blog"
      />
      <PostListing itemType="BlogPosting" posts={props.posts} />
    </>
  )
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
