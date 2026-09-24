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
      // Last.fm's CDN intermittently 404s covers, and a remote image that
      // fails to load fails the build. averageColorFromURL returns null when
      // it couldn't fetch the cover, so drop those albums.
      const loadable = covers.filter((album) => album.coverColor !== null)
      return withOrder(loadable).map((album) => ({
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
