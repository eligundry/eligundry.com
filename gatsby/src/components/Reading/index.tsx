import React from 'react'

import useGoodreadsShelf from './useGoodreads'

interface Props {
  accountID: string
  shelf: string
}

const Reading: React.FC<Props> = ({ accountID, shelf }) => {
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
        >
          <img alt={`${book.title} - ${book.author}`} src={book.cover} />
        </a>
      ))}
    </>
  )
}

export default Reading
