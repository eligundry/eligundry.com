import React, { useState } from 'react'
import LazyLoad from 'react-lazyload'
import Skeleton from 'react-loading-skeleton'
import clsx from 'clsx'

interface LoadingProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  isLoading: boolean
  hideOnLoading: boolean
}

interface BandcampProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  bandcampID: string
  name: string
  artist: string
  url: string
  hideOnLoading?: false
}

interface SpotifyProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  spotifyID: string
}

const SpotifyAlbumEmbed: React.FC<SpotifyProps & LoadingProps> = ({
  spotifyID,
  className,
  hideOnLoading,
  isLoading,
  ...props
}) => (
  <iframe
    className={clsx(
      'border-0',
      hideOnLoading === isLoading && 'hidden',
      className
    )}
    style={{
      width: '320px',
      height: '380px',
    }}
    src={`https://open.spotify.com/embed/album/${spotifyID}`}
    height="380"
    frameBorder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    title="album embed from spotify.com"
    {...props}
  />
)

const BandcampAlbumEmbed: React.FC<BandcampProps & LoadingProps> = ({
  name,
  artist,
  url,
  bandcampID,
  className,
  hideOnLoading,
  isLoading,
  ...props
}) => (
  <iframe
    src={`https://bandcamp.com/EmbeddedPlayer/album=${bandcampID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`}
    seamless
    className={clsx(
      'border-0',
      hideOnLoading === isLoading && 'hidden',
      className
    )}
    style={{
      width: '320px',
      height: '470px',
    }}
    title="album embed from bandcamp.com"
    {...props}
  >
    <a href={url}>
      {name} by {artist}
    </a>
  </iframe>
)

const AlbumEmbed: React.FC<BandcampProps | SpotifyProps> = (props) => {
  const [loading, setLoading] = useState(true)

  // Unfortunately, if I add the skeleton to the Bandcamp embed, the album art
  // does not load.
  return (
    <>
      {'spotifyID' in props && (
        <Skeleton
          height={'spotifyID' in props ? 380 : undefined}
          className={clsx('border-0')}
          style={{
            height: 'spotifyID' in props ? '380px' : '470px',
            width: '320px',
          }}
          {...props}
        />
      )}
      <LazyLoad once>
        {'spotifyID' in props ? (
          <SpotifyAlbumEmbed
            onLoad={() => setLoading(false)}
            isLoading={loading}
            hideOnLoading={true}
            {...props}
          />
        ) : (
          <BandcampAlbumEmbed
            onLoad={() => setLoading(false)}
            isLoading={true}
            hideOnLoading={false}
            {...props}
          />
        )}
      </LazyLoad>
    </>
  )
}

export default AlbumEmbed
