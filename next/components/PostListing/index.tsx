import React from 'react'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'

import Time from '@/components/Shared/Time'
import EmojiText from '@/components/Shared/EmojiText'
import { Post } from '@/lib/blog'
import TagPicker, { useSelectedTag } from './TagPicker'

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

const Article = styled.article`
  ${tw`mb-8`}

  &:last-child {
    ${tw`mb-0`}
  }

  & h1 {
    ${tw`font-extrabold text-3xl leading-none`}
  }

  & > * {
    ${tw`mb-2`}
  }

  & .description {
    margin-top: 0;
  }
`

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
        <Article
          key={post.path}
          itemScope
          itemType={`https://schema.org/${itemType}`}
          className="listing-post"
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
            <p itemProp="description" className="description">
              <EmojiText label="description of the blog post" emoji="📝">
                {post.description}
              </EmojiText>
            </p>
          )}
        </Article>
      ))}
    </>
  )
}

export default PostListing
