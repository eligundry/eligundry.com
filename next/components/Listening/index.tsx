import React from 'react'
import tw, { styled } from 'twin.macro'
import LazyLoad from 'react-lazyload'
import useMeasure from 'react-use/lib/useMeasure'
import Skeleton from 'react-loading-skeleton'

import type { LastFMCoverItem } from '@/lib/lastfm'
import LastFmCover from './LastFmCover'
import useIsMobile from '../../utils/useIsMobile'

interface Props {
  spotifyEmbedURL: string
  lastfmCover: LastFMCoverItem[]
}

const ListeningContainer = styled.div`
  ${tw`flex flex-row xs:flex-col sm:flex-col`}

  & > div {
    height: 100%;
  }

  & .last-fm-image {
    height: fit-content;
  }

  & .spotify-playlist-wrapper {
    ${tw`mr-4 xs:mb-4 sm:mb-4`}
    max-width: 100%;
    height: fit-content;
  }
`

const Listening: React.FC<Props> = ({ spotifyEmbedURL, lastfmCover }) => {
  const [ref, { height }] = useMeasure<HTMLAnchorElement>()
  const iframeHeight = useIsMobile() ? 380 : height

  return (
    <ListeningContainer>
      <div>
        <h3>Seasonal Playlist</h3>
        <LazyLoad
          once
          classNamePrefix="spotify-playlist"
          placeholder={<Skeleton height={iframeHeight} width={300} />}
        >
          <iframe
            title="Spotify playlist that I have on repeat"
            src={spotifyEmbedURL}
            width="300"
            height={iframeHeight}
            frameBorder="0"
            allow="encrypted-media"
          />
        </LazyLoad>
      </div>

      <div>
        <h3>On Repeat</h3>
        <LastFmCover data={lastfmCover} ref={ref} />
      </div>
    </ListeningContainer>
  )
}

export default Listening
