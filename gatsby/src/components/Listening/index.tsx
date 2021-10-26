import React from 'react'
import tw, { styled } from 'twin.macro'
import LazyLoad from 'react-lazyload'
import useMeasure from 'react-use/lib/useMeasure'

import LastFmCover from './LastFmCover'
import useIsMobile from '../../utils/useIsMobile'

interface Props {
  spotifyEmbedURL: string
}

const ListeningContainer = styled.div`
  ${tw`flex flex-row xs:flex-col sm:flex-col`}

  & > .last-fm-image {
    height: fit-content;
  }

  & > .spotify-playlist-wrapper {
    ${tw`mr-4 xs:mb-4 sm:mb-4`}
    max-width: 100%;
  }
`

const Listening: React.FC<Props> = ({ spotifyEmbedURL }) => {
  const [ref, { width, height }] = useMeasure()
  const iframeHeight = useIsMobile() ? 380 : height

  return (
    <ListeningContainer>
      <LazyLoad once offset={300} classNamePrefix="spotify-playlist">
        <iframe
          title="Spotify playlist that I have on repeat"
          src={spotifyEmbedURL}
          width="300"
          height={iframeHeight}
          frameBorder="0"
          allow="encrypted-media"
        />
      </LazyLoad>

      <a
        href="https://www.last.fm/user/eli_pwnd"
        ref={ref}
        className="last-fm-image"
      >
        <LastFmCover width={width} height={height} />
      </a>
    </ListeningContainer>
  )
}

export default Listening
