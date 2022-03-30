import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'

import PostTemplate from '@/components/Post'
import SEO from '@/components/SEO'
import Comments from '@/components/Comments'
import blog, { Post } from '@/lib/blog'
import daylio, { LimitedDaylioPageProps } from '@/lib/daylio'
import DaylioProvider from '@/components/Daylio/Provider'

interface Props extends LimitedDaylioPageProps {
  post: Post
}

const BlogPost: NextPage<Props> = ({ post }) => {
  return (
    <DaylioProvider>
      <SEO path={post.path} post={post} />
      <PostTemplate
        title={post.frontmatter.title}
        body={post.markdown}
        datePublished={post?.frontmatter?.date}
        itemType="BlogPosting"
        featuredImageURL={post.frontmatter.cover}
        footer={
          <>
            <hr />
            <Comments />
          </>
        }
        preBody={
          post?.frontmatter?.tags?.includes('icymi') && (
            <blockquote>
              <abbr title="I See You Missed It">ICYMI</abbr> is a series where I
              review and recommend old albums that you may have missed. I used
              to write them in a #music Slack channel at a previous job, but now
              I write them here.
            </blockquote>
          )
        }
      />
    </DaylioProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await blog.getAll('blog', ['slug'])

  return {
    paths: posts.map(({ frontmatter: { slug } }) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async ({
  params,
}) => {
  if (!params?.slug) {
    throw new Error('this route requires a slug')
  }

  const post = await blog.getBySlug('blog', params.slug)

  if (!post) {
    throw new Error(`could not find post with slug ${params.slug}`)
  }

  return {
    props: {
      post,
      ...(await daylio.getLimitedProps()),
    },
  }
}

export default BlogPost
