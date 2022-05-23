import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import promiseHash from 'promise-hash'

import PostTemplate from '@/components/Post'
import SEO from '@/components/SEO'
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
    | 'location'
  >
}

const Talk: NextPage<Props> = ({ post }) => (
  <>
    <SEO path={post.path} post={post} />
    <PostTemplate
      title={post.title}
      body={post.body}
      itemType="CreativeWork"
      datePublished={post.date}
      dateModified={post.modified}
      location={post.location}
      readingTime={post.readingTime}
    />
  </>
)

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = blog.getAll('talks', ['slug'])

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

  const post = blog.getBySlug('talks', params.slug, [
    'title',
    'description',
    'slug',
    'path',
    'tags',
    'body',
    'collection',
    'location',
    'date',
    'modified',
    'readingTime',
  ])

  if (!post) {
    throw new Error(`could not find talk with slug ${params.slug}`)
  }

  return {
    props: await promiseHash({
      post,
      daylio: daylioAPI.getLimitedProps().then((r) => r.daylio),
    }),
  }
}

export default Talk
