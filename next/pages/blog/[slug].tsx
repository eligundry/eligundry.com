import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import promiseHash from 'promise-hash'

import PostTemplate from '@/components/Post'
import SEO from '@/components/SEO'
import Comments from '@/components/Comments'
import blog, { Post } from '@/lib/blog'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'

interface Props extends LimitedDaylioPageProps {
  post: Post
}

const BlogPost: NextPage<Props> = ({ post }) => (
  <>
    <SEO path={post.path} post={post} />
    <PostTemplate
      title={post.frontmatter.title}
      body={post.code}
      datePublished={post?.frontmatter?.date}
      dateModified={post.modified}
      itemType="BlogPosting"
      featuredImageURL={post.frontmatter.cover}
      readingTime={post.frontmatter?.readingTime}
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
            review and recommend old albums that you may have missed. I used to
            write them in a #music Slack channel at a previous job, but now I
            write them here.
          </blockquote>
        )
      }
    />
  </>
)

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

  return {
    props: await promiseHash({
      post: blog
        .getBySlug('blog', params.slug, [
          'title',
          'description',
          'slug',
          'path',
          'tags',
          'code',
          'collection',
          'date',
          'modified',
          'readingTime',
        ])
        .then((post) => {
          if (!post) {
            throw new Error(`could not find talk with slug ${params.slug}`)
          }

          return post
        }),
      daylio: daylioAPI.getLimitedProps().then((r) => r.daylio),
    }),
  }
}

export default BlogPost
