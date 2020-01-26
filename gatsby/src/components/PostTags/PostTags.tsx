import React from 'react'
import kebabCase from 'lodash/kebabCase'
import { Link } from 'gatsby'

interface Props {
  tags: string[]
}

const PostTags: React.FC<Props> = ({ tags }) => (
  <div className="post-tag-container">
    {tags &&
      tags.map(tag => (
        <Link
          key={tag}
          style={{ textDecoration: 'none' }}
          to={`/blog/tags/${kebabCase(tag)}`}
        >
          <button type="button">{tag}</button>
        </Link>
      ))}
  </div>
)

export default PostTags
