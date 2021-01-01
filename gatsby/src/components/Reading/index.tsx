import React from 'react'

import useGoodreadsShelf from './useGoodreads'

interface Props {
  accountID: string
  shelf: string
}

const Reading: React.FC<Props> = ({ accountID, shelf }) => {
  // With Goodreads deprecating their API, I need to screen scrape my now
  // reading page to get a pretty view. Luckily, this is pretty easy.
  const { books } = useGoodreadsShelf(accountID, shelf)

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
        >
          <img alt={`${book.title} - ${book.author}`} src={book.cover} />
        </a>
      ))}
    </>
  )
}

export default Reading
