import { IGatsbyImageData } from 'gatsby-plugin-image'

export interface Meme {
  id: number
  url: string
  size: (number | null)[]
  notes: string
  image: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
  created_at: Date
}
