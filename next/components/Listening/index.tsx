import React from 'react'
import LazyLoad from 'react-lazyload'
import useMeasure from 'react-use/lib/useMeasure'
import Skeleton from 'react-loading-skeleton'

import type { LastFMCoverItem } from '@/lib/lastfm'
import { useIsMobile } from '@/hooks/useMediaQuery'
import LastFmCover from './LastFmCover'
import styles from './Listening.module.scss'

interface Props {
  spotifyEmbedURL: string
  lastfmCover: LastFMCoverItem[]
}

const Listening: React.FC<Props> = ({ spotifyEmbedURL, lastfmCover }) => {
  const [ref, { height }] = useMeasure<HTMLAnchorElement>()
  const iframeHeight = useIsMobile() ? 380 : height

  return (
    <div className={styles.container}>
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
    </div>
  )
}

export default Listening
