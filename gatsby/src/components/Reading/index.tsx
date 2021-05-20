import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'

import useGoodreadsShelf from './useGoodreads'

const Reading: React.FC = () => {
  const books = useGoodreadsShelf()

  if (!books) {
    return null
  }

  return (
    <>
      {books.map(book => (
        <a
          href={book.url}
          title={`${book.title} - ${book.author}`}
          target="_blank"
          key={book.isbn}
          rel="noopener noreferrer"
        >
          <GatsbyImage
            image={book.coverImage.childImageSharp.gatsbyImageData}
            alt={`${book.title} - ${book.author}`}
          />
        </a>
      ))}
    </>
  )
}

export default Reading
