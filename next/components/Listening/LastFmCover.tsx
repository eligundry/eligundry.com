import React from 'react'
import Image from 'next/image'
import { styled } from 'twin.macro'

import type { LastFMCoverItem } from '@/lib/lastfm'

interface Props {
  data: LastFMCoverItem[]
}

const LastFmCover = React.forwardRef<HTMLAnchorElement, Props>(
  ({ data }, ref) => {
    return (
      <Wrapper
        href="https://www.last.fm/user/eli_pwnd"
        className="last-fm-image"
        ref={ref}
      >
        {data.map(({ album, artist, count, cover }) => (
          <Image
            src={cover}
            width={300}
            height={300}
            alt={`${album} - ${artist} [${count} scrobbles]`}
            data-tip={`${album} - ${artist} [${count} scrobbles]`}
          />
        ))}
      </Wrapper>
    )
  }
)

const Wrapper = styled.a`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

export default LastFmCover
