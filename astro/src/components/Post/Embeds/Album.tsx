/* jsxImportSource: preact */
import clsx from 'clsx'

interface BandcampProps extends HTMLIFrameElement {
  bandcampID: string
  name: string
  artist: string
  url: string
  hideOnLoading?: false
}

interface SpotifyProps extends HTMLIFrameElement {
  spotifyID: string
}

const SpotifyAlbumEmbed = ({
  spotifyID,
  className,
  ...props
}: SpotifyProps) => (
  <iframe
    className={clsx('border-0', className)}
    src={`https://open.spotify.com/embed/album/${spotifyID}`}
    height="380"
    frameBorder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    {...props}
  />
)

const BandcampAlbumEmbed = ({
  name,
  artist,
  url,
  bandcampID,
  className,
  ...props
}: BandcampProps) => (
  <iframe
    src={`https://bandcamp.com/EmbeddedPlayer/album=${bandcampID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`}
    seamless
    className={clsx('border-0', className)}
    height="470"
    width="320"
    {...props}
  >
    <a href={url}>
      {name} by {artist}
    </a>
  </iframe>
)

const AlbumEmbed = (props: BandcampProps | SpotifyProps) => {
  if ('spotifyID' in props) {
    return <SpotifyAlbumEmbed {...props} />
  }

  return <BandcampAlbumEmbed {...props} />
}

export default AlbumEmbed
