import React, { useMemo } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { useStaticQuery, graphql } from 'gatsby'
import groupBy from 'lodash/groupBy'
import subDays from 'date-fns/subDays'

interface Props {
  width: number
  height: number
}

const LastFmCover: React.FC<Props> = ({ width, height }) => {
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
              name
            }
            artist {
              name
            }
          }
        }
      }
    }
  `)
  const topAlbums =
    useMemo(() => getTopAlbums(query.playback.scrobbles), [
      query.playback.scrobbles.length,
    ]) ?? getTopAlbums(query.playback.scrobbles)

  let mapX = 0
  let mapY = 0
  const albumWidth = Math.round(width / 3)
  const albumHeight = Math.round(width / 3)

  return (
    <>
      <GatsbyImage
        image={getImage(query.cover.image)}
        useMap="#albums"
        className="listening-img"
        alt={`My top 9 albums for the past 7 days. (${topAlbums
          .map(
            ({ album, artist, count }) =>
              `${album} - ${artist} [${count} listens]`
          )
          .join(', ')})`}
      />
      <map name="albums">
        {topAlbums.map(({ album, artist, count }, i) => {
          const topLeft = [mapX, mapY]
          const bottomRight = [(mapX += albumWidth), mapY + albumHeight]

          if ((i + 1) % 3 === 0) {
            mapY += albumHeight
            mapX = 0
          }

          return (
            <area
              key={`${album} - ${artist} [${count} listens]`}
              shape="rect"
              coords={[...topLeft, ...bottomRight].join(',')}
              title={`${album} - ${artist} [${count} listens]`}
            />
          )
        })}
      </map>
    </>
  )
}

const getTopAlbums = (
  scrobbles: GatsbyTypes.LastFmQuery['playback']['scrobbles']
) => {
  const cutoffTimeStamp = Number(subDays(new Date(), 7)) / 1000
  const scopedScrobbles = scrobbles.filter(
    scrobble => parseInt(scrobble.date) >= cutoffTimeStamp
  )
  const groupedScrobbles = groupBy(
    scopedScrobbles,
    scrobble => `${scrobble.track.album?.name} - ${scrobble.track.artist?.name}`
  )
  const topAlbums = Object.values(groupedScrobbles)
    .map(group => ({
      album: group[0].track.album.name,
      artist: group[0].track.artist.name,
      count: group.length,
    }))
    .sort((a, b) => {
      if (b.count === a.count) {
        return b.album > a.album ? -1 : 1
      }

      return b.count - a.count
    })
    .slice(0, 9)

  return topAlbums
}

export default LastFmCover
