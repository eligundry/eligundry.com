import React from 'react'
import Image from 'next/image'

import type { GoodReadsBook } from '@/lib/goodreads'
import styles from './index.module.scss'

export interface ReadingProps {
  current: GoodReadsBook[]
  read: GoodReadsBook[]
}

const Reading: React.FC<ReadingProps> = ({ current, read }) => (
  <div className="shelves">
    <div className={styles.shelf}>
      {current.map((book) => (
        <Book key={book.isbn} shelf="current" {...book} />
      ))}
      {read.map((book) => (
        <Book key={book.isbn} shelf="read" {...book} />
      ))}
    </div>
  </div>
)

const Book: React.FC<GoodReadsBook & { shelf: 'current' | 'read' }> = ({
  url,
  title,
  author,
  cover,
  shelf,
  placeholder,
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
        blurDataURL={placeholder}
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
