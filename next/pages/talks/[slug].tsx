import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import promiseHash from 'promise-hash'

import PostTemplate from '@/components/Post'
import SEO from '@/components/SEO'
import blog, { Post } from '@/lib/blog'
import daylio, { LimitedDaylioPageProps } from '@/lib/daylio'
import DaylioProvider from '@/components/Daylio/Provider'

interface Props extends LimitedDaylioPageProps {
  post: Post
}

const Talk: NextPage<Props> = ({ post, daylio }) => {
  return (
    <DaylioProvider {...daylio}>
      <SEO path={post.path} post={post} />
      <PostTemplate
        title={post.frontmatter.title}
        body={post.markdown}
        itemType="CreativeWork"
        datePublished={post?.frontmatter?.date}
        location={post?.frontmatter?.location}
      />
    </DaylioProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await blog.getAll('talks', ['slug'])

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
        .getBySlug('talks', params.slug, [
          'title',
          'description',
          'slug',
          'path',
          'tags',
          'markdown',
          'collection',
          'location',
          'date',
        ])
        .then((post) => {
          if (!post) {
            throw new Error(`could not find talk with slug ${params.slug}`)
          }

          return post
        }),
      daylio: daylio.getLimitedProps().then((r) => r.daylio),
    }),
  }
}

export default Talk
