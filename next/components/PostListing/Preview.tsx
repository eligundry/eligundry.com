import React from 'react'

import Post from '@/components/Post'
import { Post as PostType } from '@/lib/blog'

export interface PostPreviewListingProps {
  posts: Pick<
    PostType,
    | 'title'
    | 'path'
    | 'date'
    | 'description'
    | 'tags'
    | 'cover'
    | 'modified'
    | 'readingTime'
    | 'excerpt'
  >[]
  itemType: 'CreativeWork' | 'BlogPosting'
}
const PostPreviewListing: React.FC<PostPreviewListingProps> = ({
  posts,
  itemType,
}) => {
  return (
    <>
      {posts.map((post) => (
        <Post
          preview
          title={post.title}
          body={post.excerpt}
          datePublished={post.date}
          dateModified={post.modified}
          itemType={itemType}
        />
      ))}
    </>
  )
}

export default PostPreviewListing
