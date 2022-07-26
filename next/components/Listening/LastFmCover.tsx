import React from 'react'
import Image from 'next/image'

import type { LastFMCoverItem } from '@/lib/lastfm'
import styles from './Listening.module.scss'

interface Props {
  data: LastFMCoverItem[]
}

const LastFmCover = React.forwardRef<HTMLAnchorElement, Props>(
  ({ data }, ref) => (
    <a
      href="https://www.last.fm/user/eli_pwnd"
      className={styles.lastFMWrapper}
      ref={ref}
    >
      {data.map(({ album, artist, count, cover }) => (
        <Image
          key={`${artist} ${album}`}
          src={cover}
          width={300}
          height={300}
          alt={`${album} - ${artist} [${count} scrobbles]`}
          data-tip={`${album} - ${artist} [${count} scrobbles]`}
        />
      ))}
    </a>
  )
)

LastFmCover.displayName = 'LastFmCover'

export default LastFmCover
