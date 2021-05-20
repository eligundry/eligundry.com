import { useStaticQuery, graphql } from 'gatsby'

export default function useMemes() {
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
