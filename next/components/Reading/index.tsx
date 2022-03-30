import React from 'react'
import { styled } from 'twin.macro'
import Image from 'next/image'

import type { GoodReadsBook } from '@/lib/goodreads'

export interface ReadingProps {
  current: GoodReadsBook[]
  read: GoodReadsBook[]
}

const Reading: React.FC<ReadingProps> = ({ current, read }) => (
  <div className="shelves">
    <Shelf>
      {current.map((book) => (
        <Book key={book.isbn} shelf="current" {...book} />
      ))}
      {read.map((book) => (
        <Book key={book.isbn} shelf="read" {...book} />
      ))}
    </Shelf>
  </div>
)

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

const Book: React.FC<GoodReadsBook & { shelf: 'current' | 'read' }> = ({
  url,
  title,
  author,
  cover,
  shelf,
}) => {
  let correctAuthor = ''

  if (!cover) {
    return null
  }

  if (author) {
    correctAuthor = author.split(', ').reverse().join(' ')
  }

  return (
    <a
      href={url ?? '#'}
      data-tip={`${
        shelf === 'current' ? 'Currently Reading: ' : ''
      }${title} - ${correctAuthor}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={cover}
        blurDataURL={cover}
        placeholder="blur"
        alt={`${title} - ${correctAuthor}`}
        width={128}
        height={194}
        quality={90}
      />
    </a>
  )
}

export default Reading
