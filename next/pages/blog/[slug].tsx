import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'

import PostTemplate from '@/components/Post'
import SEO from '@/components/SEO'
import blog, { Post } from '@/lib/blog'

const BlogPost: NextPage<{ post: Post }> = ({ post }) => {
  return (
    <>
      <SEO path={post.path} post={post} />
      <PostTemplate
        title={post.frontmatter.title}
        body={post.markdown}
        itemType="BlogPosting"
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await blog.getBySlug('blog', params.slug as string)

  return {
    props: { post },
  }
}

export default BlogPost
