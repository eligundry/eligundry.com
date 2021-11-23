import React, { useState } from 'react'
import LazyLoad from 'react-lazyload'
import Skeleton from 'react-loading-skeleton'
import tw, { styled, css } from 'twin.macro'

interface LoadingProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  loading: boolean
  hideOnLoading: boolean
}

interface BandcampProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  bandcampID: string
  name: string
  artist: string
  url: string
}

interface SpotifyProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  spotifyID: string
}

const AlbumEmbedIframe = styled.iframe<LoadingProps>`
  border: 0;
  width: 320px;
  ${({ height = 470 }) =>
    css`
      height: ${height}px};
    `}

  ${(props) => props.hideOnLoading === props.loading && tw`hidden`}
`

const AlbumEmbedLoadingSkeleton = AlbumEmbedIframe.withComponent(Skeleton)

const SpotifyAlbumEmbed: React.FC<SpotifyProps & LoadingProps> = ({
  spotifyID,
  className,
  ...props
}) => {
  return (
    <AlbumEmbedIframe
      className={className}
      src={`https://open.spotify.com/embed/album/${spotifyID}`}
      height="380"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      {...props}
    />
  )
}

const BandcampAlbumEmbed: React.FC<BandcampProps & LoadingProps> = ({
  name,
  artist,
  url,
  bandcampID,
  className,
  ...props
}) => {
  return (
    <AlbumEmbedIframe
      src={`https://bandcamp.com/EmbeddedPlayer/album=${bandcampID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`}
      seamless
      className={className}
      {...props}
    >
      <a href={url}>
        {name} by {artist}
      </a>
    </AlbumEmbedIframe>
  )
}

const AlbumEmbed: React.FC<BandcampProps | SpotifyProps> = (props) => {
  const [loading, setLoading] = useState(true)

  // Unfortunately, if I add the skeleton to the Bandcamp embed, the album art
  // does not load.
  return (
    <>
      {'spotifyID' in props && (
        <AlbumEmbedLoadingSkeleton
          height={'spotifyID' in props ? 380 : undefined}
          hideOnLoading={false}
          loading={loading}
          {...props}
        />
      )}
      <LazyLoad once>
        {'spotifyID' in props ? (
          <SpotifyAlbumEmbed
            onLoad={() => setLoading(false)}
            loading={loading}
            hideOnLoading={true}
            {...props}
          />
        ) : (
          <BandcampAlbumEmbed
            onLoad={() => setLoading(false)}
            loading={true}
            hideOnLoading={false}
            {...props}
          />
        )}
      </LazyLoad>
    </>
  )
}

export default AlbumEmbed
