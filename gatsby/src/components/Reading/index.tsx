import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { styled } from 'twin.macro'

import useGoodreadsShelf from './useGoodreads'

const Reading: React.FC = () => {
  const shelves = useGoodreadsShelf()

  if (!shelves.currentlyReading || !shelves.recentlyFinished) {
    return null
  }

  return (
    <div className="shelves">
      <Shelf>
        {shelves.currentlyReading.books.map((book) => (
          <Book key={book.isbn} shelf="currently-reading" {...book} />
        ))}
        {shelves.recentlyFinished.books.map((book) => (
          <Book key={book.isbn} shelf="recently-finished" {...book} />
        ))}
      </Shelf>
    </div>
  )
}

const Shelf = styled.div`
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
`

const Book: React.FC<
  GatsbyTypes.UseGoodreadsShelvesQuery['currentlyReading']['books'][0] & {
    shelf: 'currently-reading' | 'recently-finished'
  }
> = ({ url, title, author, coverImage, shelf }) => {
  // @ts-ignore
  const image = getImage(coverImage)
  let correctAuthor = ''

  if (!image) {
    return null
  }

  if (author) {
    correctAuthor = author.split(', ').reverse().join(' ')
  }

  return (
    <a
      href={url}
      data-tip={`${
        shelf === 'currently-reading' ? 'Currently Reading: ' : ''
      }${title} - ${correctAuthor}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <GatsbyImage image={image} alt={`${title} - ${correctAuthor}`} />
    </a>
  )
}

export default Reading
