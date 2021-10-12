import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'

import useGoodreadsShelf from './useGoodreads'

const Reading: React.FC = () => {
  const shelves = useGoodreadsShelf()

  if (!shelves.currentlyReading || !shelves.recentlyFinished) {
    return null
  }

  return (
    <div className="shelves">
      <div className="shelf">
        <h3>Currently Reading</h3>
        <div className="books">
          {shelves.currentlyReading.books.map(book => (
            <Book key={book.isbn} {...book} />
          ))}
        </div>
      </div>
      <div className="shelf">
        <h3>Recently Finished</h3>
        <div className="books">
          {shelves.recentlyFinished.books.map(book => (
            <Book key={book.isbn} {...book} />
          ))}
        </div>
      </div>
    </div>
  )
}

const Book: React.FC<GatsbyTypes.UseGoodreadsShelvesQuery['currentlyReading']['books'][0]> = ({
  url,
  title,
  author,
  coverImage,
}) => (
    <a
      href={url}
      data-tip={`${title} - ${author}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <GatsbyImage
        image={coverImage.childImageSharp.gatsbyImageData}
        alt={`${title} - ${author}`}
      />
    </a>
  )

export default Reading
