import type { NextPage, GetStaticProps } from 'next'

import PostListing from '@/components/PostListing'
import Paper from '@/components/Shared/Paper'
import SEO from '@/components/SEO'
import DaylioProvider, {
  LimitedDaylioPageProps,
} from '@/components/Daylio/Provider'
import blog, { Post } from '@/lib/blog'
import daylio from '@/lib/daylio'
import { generateBlogFeed } from '@/lib/feed'

interface PageProps extends LimitedDaylioPageProps {
  posts: Post[]
}

const Blog: NextPage<PageProps> = ({ posts, daylio }) => {
  return (
    <DaylioProvider {...daylio}>
      <SEO
        title="Blog"
        description="Thoughts, tutorials, musings, album reviews and everything in between that I have written down."
        path="/blog"
      />
      <Paper className="listing-container">
        <PostListing itemType="BlogPosting" posts={posts} />
      </Paper>
    </DaylioProvider>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const posts = await blog.getAll(
    'blog',
    ['title', 'path', 'date', 'description', 'tags', 'draft'],
    { draft: false }
  )
  await generateBlogFeed()

  return {
    props: {
      posts,
      daylio: {
        entries: [await daylio.getLatest()],
      },
    },
  }
}

export default Blog
