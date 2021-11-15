import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import tw, { styled, theme } from 'twin.macro'

import useGoodreadsShelf from './useGoodreads'

const Reading: React.FC = () => {
  const shelves = useGoodreadsShelf()

  if (!shelves.currentlyReading || !shelves.recentlyFinished) {
    return null
  }

  return (
    <div className="shelves">
      <Shelf className="shelf">
        <h3>Currently Reading</h3>
        <div className="books">
          {shelves.currentlyReading.books.map((book) => (
            <Book key={book.isbn} {...book} />
          ))}
        </div>
      </Shelf>
      <Shelf>
        <h3>Recently Finished</h3>
        <div className="books">
          {shelves.recentlyFinished.books.map((book) => (
            <Book key={book.isbn} {...book} />
          ))}
        </div>
      </Shelf>
    </div>
  )
}

const Shelf = styled.div`
  & h3 {
    ${tw`font-semibold text-primary`}
  }

  & .books {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    column-gap: 1vw;
    margin: 0 1vw 1vw;
    margin-left: 0;
    text-align: center;

    & a {
      flex: 1;
    }

    & img {
      min-width: 75px;
    }
  }
`

const Book: React.FC<
  GatsbyTypes.UseGoodreadsShelvesQuery['currentlyReading']['books'][0]
> = ({ url, title, author, coverImage }) => (
  <a
    href={url}
    data-tip={`${title} - ${author}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <GatsbyImage image={getImage(coverImage)} alt={`${title} - ${author}`} />
  </a>
)

export default Reading
