import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import lastfm, { type LastFMPeriod } from '../lib/lastfm'
import { withOrder } from '../lib/collections'

export const createLastFmCoverCollection = (
  username: string,
  period: LastFMPeriod = '7day'
) => {
  return defineCollection({
    loader: async () => {
      const covers = await lastfm.getTopAlbumsCover(username, period)
      return withOrder(covers).map((album) => ({
        ...album,
        id: album.url,
      }))
    },
    schema: z.object({
      album: z.string(),
      artist: z.string(),
      count: z.number(),
      cover: z.string(),
      coverColor: z.string().nullable(),
      url: z.url(),
      order: z.number(),
    }),
  })
}
