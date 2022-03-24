import type { NextPage, GetStaticProps } from 'next'

import * as blog from '@/lib/blog'
import daylio from '@/lib/daylio'

const Blog: NextPage = (props) => {
  return <pre>{JSON.stringify(props, undefined, 2)}</pre>
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await blog.getAll('posts', [
    'title',
    'path',
    'date',
    'description',
  ])
  const latestFeeling = await daylio.getLatest()

  return {
    props: {
      latestFeeling,
      posts,
    },
  }
}

export default Blog
