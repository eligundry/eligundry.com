import type { NextPage, GetStaticProps } from 'next'
import promiseHash from 'promise-hash'

import PostListing, { PostListingProps } from '@/components/PostListing'
import Paper from '@/components/Shared/Paper'
import SEO from '@/components/SEO'
import blog from '@/lib/blog'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'
import { generateBlogFeed } from '@/lib/feed'

interface PageProps extends LimitedDaylioPageProps {
  posts: PostListingProps['posts']
}

const Blog: NextPage<PageProps> = ({ posts }) => (
  <>
    <SEO
      title="Blog"
      description="Thoughts, tutorials, musings, album reviews and everything in between that I have written down."
      path="/blog"
    />
    <Paper className="listing-container">
      <PostListing itemType="BlogPosting" posts={posts} />
    </Paper>
  </>
)

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  generateBlogFeed()

  return {
    props: await promiseHash({
      posts: blog.getAll('blog', [
        'title',
        'path',
        'date',
        'description',
        'tags',
        'cover',
        'modified',
        'readingTime',
        'draft',
        'slug',
      ]),
      daylio: daylioAPI.getLimitedProps().then((r) => r.daylio),
    }),
  }
}

export default Blog
