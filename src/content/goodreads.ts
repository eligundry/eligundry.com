import { defineCollection, z } from 'astro:content'
import goodreads, { type GetShelf } from '../lib/goodreads'

export const createGoodreadsCollection = (params: GetShelf) => {
  return defineCollection({
    loader: async () => {
      const shelf = await goodreads.getShelf(params)
      return shelf.map((book) => ({
        ...book,
        id: book.isbn13,
      }))
    },
    schema: z.object({
      title: z.string().nullable(),
      author: z.string().nullable(),
      isbn: z.string().nullable(),
      isbn13: z.string().nullable(),
      asin: z.string().nullable(),
      pages: z.number().nullable(),
      published: z.string().nullable(),
      started: z.string().nullable(),
      finished: z.string().nullable(),
      cover: z.string().nullable(),
      thumbnail: z.string().nullable().optional(),
      url: z.string().nullable(),
      coverColor: z.string().nullable(),
    }),
  })
}
