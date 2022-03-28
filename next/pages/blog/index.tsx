import type { NextPage, GetStaticProps } from 'next'

import PostListing from '@/components/PostListing'
import Paper from '@/components/Shared/Paper'
import SEO from '@/components/SEO'
import blog, { Post } from '@/lib/blog'

const Blog: NextPage<{ posts: Post[] }> = (props) => {
  return (
    <>
      <SEO
        title="Blog"
        description="Thoughts, tutorials, musings, album reviews and everything in between that I have written down."
        path="/blog"
      />
      <Paper className="listing-container">
        <PostListing itemType="BlogPosting" posts={props.posts} />
      </Paper>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await blog.getAll(
    'blog',
    ['title', 'path', 'date', 'description', 'tags', 'draft'],
    { draft: false }
  )

  return {
    props: {
      posts,
    },
  }
}

export default Blog
