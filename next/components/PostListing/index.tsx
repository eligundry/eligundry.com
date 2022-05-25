import React from 'react'
import Link from 'next/link'

import Time from '@/components/Shared/Time'
import EmojiText from '@/components/Shared/EmojiText'
import { Post } from '@/lib/blog'
import TagPicker, { useSelectedTag } from './TagPicker'
import styles from './index.module.scss'

export interface PostListingProps {
  posts: Pick<
    Post,
    | 'title'
    | 'path'
    | 'date'
    | 'description'
    | 'tags'
    | 'cover'
    | 'modified'
    | 'readingTime'
  >[]
  itemType: 'CreativeWork' | 'BlogPosting'
}

const PostListing: React.FC<PostListingProps> = ({ posts, itemType }) => {
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
      {postList.map((post) => (
        <article
          key={post.path}
          itemScope
          itemType={`https://schema.org/${itemType}`}
          className={styles.article}
        >
          <link itemProp="author publisher" href="#eli-gundry" />
          {post.cover && <meta itemProp="image" content={post.cover} />}
          {post.modified && (
            <meta itemProp="dateModified" content={post.modified} />
          )}
          {post.readingTime > 0 && (
            <meta itemProp="timeRequired" content={`PT${post.readingTime}M`} />
          )}
          <h1 itemProp="name headline">
            <Link href={post.path}>
              <a itemProp="url">{post.title}</a>
            </Link>
          </h1>
          {post.date && (
            <Time dateTime={new Date(post.date)} itemProp="datePublished" />
          )}
          {post.description && (
            <p itemProp="description" className={styles.description}>
              <EmojiText label="description of the blog post" emoji="📝">
                {post.description}
              </EmojiText>
            </p>
          )}
        </article>
      ))}
    </>
  )
}

export default PostListing
