import React from 'react'
import LazyLoad from 'react-lazyload'

import { AlbumEmbed } from './BandcampAlbumEmbed'

interface Props {
  spotifyID: string
  className?: string
}

const SpotifyAlbumEmbed: React.FC<Props> = ({ spotifyID, className }) => {
  return (
    <LazyLoad once>
      <AlbumEmbed
        className={className}
        src={`https://open.spotify.com/embed/album/${spotifyID}`}
        height="380"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </LazyLoad>
  )
}

export default SpotifyAlbumEmbed
