import { defineCollection, z } from 'astro:content'
import lastfm, { type LastFMPeriod } from '../lib/lastfm'

export const createLastFmCoverCollection = (
  username: string,
  period: LastFMPeriod = '7day'
) => {
  return defineCollection({
    loader: async () => {
      const covers = await lastfm.getTopAlbumsCover(username, period)
      return covers.map((album) => ({
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
      url: z.string().url(),
    }),
  })
}
