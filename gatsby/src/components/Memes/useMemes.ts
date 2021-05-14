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
            image {
              childImageSharp {
                gatsbyImageData(quality: 100, layout: FULL_WIDTH)
              }
            }
            created_at
          }
        }
      }
    `
  )

  return memes.allMemes.memes
}
