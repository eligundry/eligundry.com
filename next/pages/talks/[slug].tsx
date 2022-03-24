import type { NextPage, GetStaticPaths, GetStaticProps } from 'next'

import blog, { Post } from '@/lib/blog'
import PostTemplate from '@/components/Post'

const BlogPost: NextPage<{ post: Post }> = ({ post }) => {
  return <PostTemplate title={post.frontmatter.title} body={post.markdown} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await blog.getAll('talks', ['slug'])

  return {
    paths: posts.map(({ frontmatter: { slug } }) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await blog.getBySlug('talks', params.slug as string)

  return {
    props: { post },
  }
}

export default BlogPost
