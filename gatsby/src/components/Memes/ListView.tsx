import React, { useState } from 'react'
import { useQuery } from 'react-query'
import tw, { styled } from 'twin.macro'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import { Meme } from './types'
import Paper from '../Shared/Paper'
import customFetch, { processResponse } from '../../utils/fetch'

const Intro = styled.blockquote`
  ${tw`italic border-l-2 border-teal-400 pl-2 m-4`}
`

const ImageList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

const Image = styled(Paper.figure)`
  & > img {
    width: auto;
    height: auto;
    // max-width: 33.3%;
    max-height: 300px;
    margin: 1em 0;
  }
`

const ImageLightbox = styled(Lightbox)``

const MemeListView: React.FC = () => {
  const [lightBoxState, setLightBoxState] = useState({
    index: 0,
    open: false,
  })
  const { data: memes, isFetching, error } = useQuery(['memes'], () =>
    customFetch('/api/memes').then(res => processResponse<Meme[]>(res))
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
        {memes.map((meme, index) => (
          <Image
            key={`meme-${meme.id}`}
            onClick={() => setLightBoxState({ index, open: true })}
          >
            <img
              src={meme.url}
              alt={meme.notes}
              width={meme.size[0] || undefined}
              height={meme.size[1] || undefined}
            />
          </Image>
        ))}
      </ImageList>
      {lightBoxState.open && (
        <ImageLightbox
          mainSrc={memes[lightBoxState.index].url}
          nextSrc={memes[(lightBoxState.index + 1) % memes.length].url}
          prevSrc={
            memes[(lightBoxState.index + memes.length - 1) % memes.length].url
          }
          onCloseRequest={() =>
            setLightBoxState(state => ({
              ...state,
              open: false,
            }))
          }
          onMovePrevRequest={() =>
            setLightBoxState(state => ({
              ...state,
              index: (state.index + memes.length - 1) % memes.length,
            }))
          }
          onMoveNextRequest={() =>
            setLightBoxState(state => ({
              ...state,
              index: (state.index + 1) % memes.length,
            }))
          }
        />
      )}
    </>
  )
}

export default MemeListView
