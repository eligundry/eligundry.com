import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'

import PostTemplate from '@/components/Post'
import SEO from '@/components/SEO'
import Comments from '@/components/Comments'
import blog, { Post } from '@/lib/blog'
import daylioAPI, { LimitedDaylioPageProps } from '@/lib/daylio'

interface Props extends LimitedDaylioPageProps {
  post: Pick<
    Post,
    | 'title'
    | 'body'
    | 'date'
    | 'modified'
    | 'cover'
    | 'readingTime'
    | 'tags'
    | 'path'
    | 'collection'
  >
}

const BlogPost: NextPage<Props> = ({ post }) => (
  <>
    <SEO path={post.path} post={post} />
    <PostTemplate
      title={post.title}
      body={post.body}
      datePublished={post.date}
      dateModified={post.modified}
      itemType="BlogPosting"
      featuredImageURL={post.cover}
      readingTime={post.readingTime}
      footer={
        <>
          <hr />
          <Comments />
        </>
      }
      preBody={
        post?.tags?.includes('icymi') && (
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
  const posts = blog.getAll('blog', ['slug'])

  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async ({
  params,
}) => {
  if (!params?.slug) {
    throw new Error('this route requires a slug')
  }

  const post = blog.getBySlug('blog', params.slug, [
    'title',
    'description',
    'slug',
    'path',
    'tags',
    'body',
    'collection',
    'date',
    'modified',
    'readingTime',
  ])

  if (!post) {
    throw new Error(`could not find blog post with slug ${params.slug}`)
  }

  const daylio = await daylioAPI.getLimitedProps().then((r) => r.daylio)

  return {
    props: {
      post,
      daylio,
    },
  }
}

export default BlogPost
