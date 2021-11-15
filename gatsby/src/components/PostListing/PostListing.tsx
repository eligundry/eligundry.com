import React from 'react'
import { Link } from 'gatsby'
import tw, { styled } from 'twin.macro'

import Time from '../Shared/Time'
import EmojiText from '../Shared/EmojiText'
import TagPicker, { useSelectedTag } from './TagPicker'

interface Props {
  postEdges: GatsbyTypes.BlogListingQuery['allMdx']['edges']
  pathPrefix: string
  itemType: 'CreativeWork' | 'BlogPosting'
}

const Article = styled.article`
  ${tw`mb-8`}

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

const PostListing: React.FC<Props> = ({ postEdges, pathPrefix, itemType }) => {
  const tags = new Set<string>()
  const [selectedTag, selectTag] = useSelectedTag()
  const postList = postEdges
    .map((postEdge) => {
      postEdge.node.frontmatter?.tags?.forEach((tag) => tags.add(tag))

      return {
        path: postEdge?.node?.fields?.slug,
        cover: postEdge?.node?.frontmatter?.cover?.publicURL,
        title: postEdge?.node?.frontmatter?.title,
        date: postEdge?.node?.fields?.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead,
        description: postEdge?.node?.frontmatter?.description,
        dateModified: postEdge?.node?.fields?.latestCommitDate,
        tags: postEdge?.node?.frontmatter?.tags,
      }
    })
    .filter(
      (post) =>
        !!post.title && (!selectedTag || post?.tags?.includes(selectedTag))
    )

  return (
    <main>
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
            <Link to={`/${pathPrefix}/${post.path}`} itemProp="url">
              {post.title}
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
    </main>
  )
}

export default PostListing
