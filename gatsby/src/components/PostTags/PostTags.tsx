import React from 'react'
import kebabCase from 'lodash/kebabCase'
import { Link } from 'gatsby'

interface Props {
  tags: string[]
}

const PostTags: React.FC<Props> = ({ tags }) => (
  <>
    {tags && tags.length && (
      <div className="post-tag-container">
        {tags.map(tag => (
          <Link
            key={tag}
            style={{ textDecoration: 'none' }}
            to={`/blog/tags/${kebabCase(tag)}`}
          >
            <span role="img" aria-label="tag">
              🏷️
            </span>
            {tag}
          </Link>
        ))}
      </div>
    )}
  </>
)

export default PostTags
