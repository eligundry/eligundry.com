import React from 'react'
import { useQuery } from 'react-query'
import tw, { styled } from 'twin.macro'

import { Meme } from './types'
import Paper from '../Shared/Paper'

const Intro = styled.blockquote`
  ${tw`italic border-l-2 border-teal-400 pl-2 m-4`}
`

const ImageList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

const Image = styled(Paper)`
  & > img {
    width: auto;
    height: auto;
    // max-width: 33.3%;
    max-height: 300px;
    margin: 1em 0;
  }
`

const MemeListView: React.FC = () => {
  const { data: memes, isFetching, error } = useQuery<Meme[]>(['memes'], () =>
    fetch('/api/memes')
      .then(res => {
        if (!res.ok) {
          throw new Error('Could not fetch memes')
        }

        return res
      })
      .then(res => res.json())
  )

  if ((!memes && isFetching) || error) {
    return null
  }

  return (
    <>
      <Intro>
        These are all memes that I have saved on my phone as memories. I own
        literally none of them and agreed with only most of the them.
        <br />
        Enjoy and don't hold it against me!
      </Intro>
      <ImageList>
        {memes.map(meme => (
          <Image key={`meme-${meme.id}`}>
            <img src={meme.url} alt="" />
          </Image>
        ))}
      </ImageList>
    </>
  )
}

export default MemeListView
