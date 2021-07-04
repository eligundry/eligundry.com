import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'

import useGoodreadsShelf from './useGoodreads'

const Reading: React.FC = () => {
  const shelves = useGoodreadsShelf()

  if (!shelves.currentlyReading || !shelves.recentlyFinished) {
    return null
  }

  console.log(shelves)

  return (
    <div className="shelves">
      <div className="shelf">
        <h3>Currently Reading</h3>
        {shelves.currentlyReading.books.map(book => (
          <a
            href={book.url}
            data-tip={`${book.title} - ${book.author}`}
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
      </div>
      <div className="shelf">
        <h3>Recently Finished</h3>
        {shelves.recentlyFinished.books.map(book => (
          <a
            href={book.url}
            data-tip={`${book.title} - ${book.author}`}
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
      </div>
    </div>
  )
}

export default Reading
