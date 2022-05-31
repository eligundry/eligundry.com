import React from 'react'
import clsx from 'clsx'

import Post from '@/components/Post'
import { Post as PostType } from '@/lib/blog'
import TagPicker, { useSelectedTag } from './TagPicker'

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
  const tags = posts.reduce((acc, post) => {
    post.tags?.forEach((tag) => acc.add(tag))
    return acc
  }, new Set<string>())
  const selectedTag = useSelectedTag()
  const postList = posts.filter(
    (post) =>
      !!post.title && (!selectedTag || post?.tags?.includes(selectedTag))
  )
  return (
    <>
      {tags.size > 0 && <TagPicker tags={tags} selectedTag={selectedTag} />}
      {postList.map((post, i) => (
        <>
          <Post
            preview
            key={post.path}
            title={post.title}
            description={post.description}
            path={post.path}
            body={post.excerpt}
            datePublished={post.date}
            dateModified={post.modified}
            itemType={itemType}
            readingTime={post.readingTime}
            jumpLink="read-more"
          />
          {i + 1 < postList.length && <hr className={clsx('my-8')} />}
        </>
      ))}
    </>
  )
}

export default PostPreviewListing
