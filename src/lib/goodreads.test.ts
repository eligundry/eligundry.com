import { test, expect } from 'vitest'
import { parseGoodreadsCSV, reviewIdFromURL } from './goodreads'

const header =
  'Book Id,Title,Author,Author l-f,Additional Authors,ISBN,ISBN13,My Rating,Average Rating,Publisher,Binding,Number of Pages,Year Published,Original Publication Year,Date Read,Date Added,Bookshelves,Bookshelves with positions,Exclusive Shelf,My Review,Spoiler,Private Notes,Read Count,Owned Copies'

test('parseGoodreadsCSV reads a Goodreads export', () => {
  const csv = [
    '﻿' + header,
    '243042929,"Cool Machine (The Harlem Trilogy, #3)",Colson Whitehead,"Whitehead, Colson",,"=""0385545797""","=""9780385545792""",5,4.31,Doubleday,Hardcover,320,2026,2026,2026/10/29,2026/9/2,,,read,"So good.<br/><br/>Loved it, ""truly"".",true,secret stuff,1,0',
    '1,Unread Book,Someone,"Someone, Else",,"=""""","=""""",0,3.9,,Paperback,,,,,2025/01/05,to-read,to-read (#1),to-read,,,,0,0',
  ].join('\n')

  const rows = parseGoodreadsCSV(csv)

  expect(rows).toEqual([
    {
      bookId: '243042929',
      title: 'Cool Machine (The Harlem Trilogy, #3)',
      author: 'Colson Whitehead',
      shelf: 'read',
      rating: 5,
      review: 'So good.<br/><br/>Loved it, "truly".',
      spoiler: true,
      dateRead: '2026-10-29',
      dateAdded: '2026-09-02',
      isbn13: '9780385545792',
      pages: 320,
      yearPublished: 2026,
    },
    {
      bookId: '1',
      title: 'Unread Book',
      author: 'Someone',
      shelf: 'to-read',
      rating: 0,
      review: null,
      spoiler: false,
      dateRead: null,
      dateAdded: '2025-01-05',
      isbn13: null,
      pages: null,
      yearPublished: null,
    },
  ])
  // Private notes stay private
  expect(JSON.stringify(rows)).not.toContain('secret stuff')
})

test('parseGoodreadsCSV rejects a row without a Book Id', () => {
  expect(() => parseGoodreadsCSV(`${header}\n,Title,Author`)).toThrow(/Row 2/)
})

test('reviewIdFromURL', () => {
  expect(
    reviewIdFromURL('https://www.goodreads.com/review/show/9054277513')
  ).toBe('9054277513')
  expect(reviewIdFromURL('https://www.goodreads.com/book/show/1')).toBeNull()
})
