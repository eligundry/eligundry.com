import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { useStaticQuery, graphql } from 'gatsby'
import groupBy from 'lodash/groupBy'
import subDays from 'date-fns/subDays'

const LastFmCover: React.FC = () => {
  const query = useStaticQuery<GatsbyTypes.LastFmQuery>(graphql`
    query LastFm {
      cover: downloadedImage(name: { eq: "last-fm-cover.jpg" }) {
        image {
          childImageSharp {
            gatsbyImageData(width: 800, quality: 80)
          }
        }
      }
      playback: allLastfmPlayback {
        scrobbles: nodes {
          date
          track {
            album {
              id
              name
            }
            artist {
              id
              name
            }
          }
        }
      }
    }
  `)

  const cutoffTimeStamp = Number(subDays(new Date(), 7)) / 1000
  const scopedScrobbles = query.playback.scrobbles.filter(
    scrobble => parseInt(scrobble.date) >= cutoffTimeStamp
  )
  const groupedScrobbles = groupBy(
    scopedScrobbles,
    scrobble => scrobble.track.album.id
  )
  const topAlbums = Object.values(groupedScrobbles)
    .map(group => ({
      album: group[0].track.album.name,
      artist: group[0].track.artist.name,
      count: group.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <GatsbyImage
      image={getImage(query.cover.image)}
      className="listening-img"
      alt={`My top 9 albums for the past 7 days. (${topAlbums
        .map(
          ({ album, artist, count }) =>
            `${album} - ${artist} [${count} listens]`
        )
        .join(', ')})`}
    />
  )
}

export default LastFmCover
