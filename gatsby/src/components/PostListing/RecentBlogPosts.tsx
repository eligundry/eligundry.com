import React from 'react'

import PostListing from './PostListing'
import useLatestPosts from './useLatestPosts'

const RecentBlogPosts: React.FC = () => {
  const posts = useLatestPosts()

  return <PostListing posts={posts} pathPrefix="blog" />
}

export default RecentBlogPosts
