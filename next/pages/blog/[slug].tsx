import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'

import PostTemplate from '@/components/Post'
import SEO from '@/components/SEO'
import Comments from '@/components/Comments'
import blog, { Post } from '@/lib/blog'

interface Props {
  post: Post
}

const BlogPost: NextPage<Props> = ({ post }) => {
  return (
    <>
      <SEO path={post.path} post={post} />
      <PostTemplate
        title={post.frontmatter.title}
        body={post.markdown}
        itemType="BlogPosting"
        footer={
          <>
            <hr />
            <Comments />
          </>
        }
      />
    </>
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
    props: { post },
  }
}

export default BlogPost
