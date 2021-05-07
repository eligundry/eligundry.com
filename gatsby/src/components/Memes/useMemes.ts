import { useStaticQuery, graphql } from 'gatsby'

import { Meme } from './types'

export default function useMemes(): Meme[] {
  const memes = useStaticQuery<GatsbyTypes.UseMemesQuery>(
    graphql`
      query UseMemes {
        allMemes {
          memes: nodes {
            id
            notes
            size
            url
            created_at
          }
        }
      }
    `
  )

  return memes.allMemes.memes
}
