import React from 'react'
import Image from 'next/image'
import { styled } from 'twin.macro'

import type { LastFMCoverItem } from '@/lib/lastfm'

interface Props {
  data: LastFMCoverItem[]
}

const LastFmCover = React.forwardRef<HTMLAnchorElement, Props>(
  ({ data }, ref) => (
    <Wrapper
      href="https://www.last.fm/user/eli_pwnd"
      className="last-fm-image"
      ref={ref}
    >
      {data.map(({ album, artist, count, cover, placeholder }) => (
        <Image
          key={`${artist} ${album}`}
          src={cover}
          blurDataURL={placeholder}
          placeholder="blur"
          width={300}
          height={300}
          alt={`${album} - ${artist} [${count} scrobbles]`}
          data-tip={`${album} - ${artist} [${count} scrobbles]`}
        />
      ))}
    </Wrapper>
  )
)

LastFmCover.displayName = 'LastFmCover'

const Wrapper = styled.a`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

export default LastFmCover
