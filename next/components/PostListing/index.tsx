import React from 'react'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'

import Time from '@/components/Shared/Time'
import EmojiText from '@/components/Shared/EmojiText'
import { Post } from '@/lib/blog'
import TagPicker, { useSelectedTag } from './TagPicker'

interface Props {
  posts: Post[]
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

const PostListing: React.FC<Props> = ({ posts, itemType }) => {
  const tags = new Set<string>()
  const [selectedTag, selectTag] = useSelectedTag()
  const postList = posts
    .map((post) => {
      post.frontmatter?.tags
        ?.filter((tag): tag is string => !!tag)
        .forEach((tag) => tags.add(tag))

      let cover: string | undefined

      // if (post?.frontmatter && 'cover' in postEdge.node.frontmatter) {
      //   cover = post.frontmatter.cover?.publicURL
      // }

      return {
        path: post.path,
        cover,
        title: post?.frontmatter?.title,
        date: post?.frontmatter?.date,
        timeToRead: undefined,
        description: post?.frontmatter?.description,
        dateModified: undefined,
        tags: post?.frontmatter?.tags,
      }
    })
    .filter(
      (post) =>
        !!post.title && (!selectedTag || post?.tags?.includes(selectedTag))
    )

  return (
    <>
      {tags.size > 0 && (
        <TagPicker
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={selectTag}
        />
      )}
      {postList.map((post) => (
        <Article
          key={post.path}
          itemScope
          itemType={`https://schema.org/${itemType}`}
          className="listing-post"
        >
          <link itemProp="author publisher" href="#eli-gundry" />
          <meta itemProp="image" content={post.cover} />
          <meta itemProp="dateModified" content={post.dateModified} />
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
