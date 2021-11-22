import React from 'react'
import LazyLoad from 'react-lazyload'
import { styled, css } from 'twin.macro'

interface Props {
  name: string
  artist: string
  url: string
  id: string
  className?: string
}

const BandcampAlbumEmbed: React.FC<Props> = ({
  name,
  artist,
  url,
  id,
  className,
}) => {
  return (
    <LazyLoad once>
      <AlbumEmbed
        src={`https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`}
        seamless
        className={className}
      >
        <a href={url}>
          {name} by {artist}
        </a>
      </AlbumEmbed>
    </LazyLoad>
  )
}

export const AlbumEmbed = styled.iframe`
  border: 0;
  width: 320px;
  ${({ height = 470 }) =>
    css`
      height: ${height}px};
    `}
`

export default BandcampAlbumEmbed
