import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { useStaticQuery, graphql } from 'gatsby'

const LastFmCover: React.FC = () => {
  const cover = useStaticQuery<GatsbyTypes.LastFmCoverQuery>(graphql`
    query LastFmCover {
      downloadedImage(name: { eq: "last-fm-cover.jpg" }) {
        image {
          childImageSharp {
            gatsbyImageData(width: 800, quality: 80)
          }
        }
      }
    }
  `)

  return (
    <GatsbyImage
      image={getImage(cover.downloadedImage.image)}
      className="listening-img"
      alt="My top 9 albums for the past 7 days"
    />
  )
}

export default LastFmCover
