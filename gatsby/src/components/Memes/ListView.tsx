import React, { useState } from 'react'
import tw, { styled } from 'twin.macro'
import Lightbox from 'react-image-lightbox'
import {
  LazyLoadImage,
  trackWindowScroll,
  ScrollPosition,
} from 'react-lazy-load-image-component'
import 'react-image-lightbox/style.css'

import useMemes from './useMemes'
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

const Image = styled(Paper.figure)`
  cursor: pointer;

  & > img {
    width: auto;
    height: auto;
    // max-width: 33.3%;
    max-height: 300px;
    margin: 1em 0;
  }
`

const ImageLightbox = styled(Lightbox)``

interface Props {
  scrollPosition?: ScrollPosition
}

const MemeListView: React.FC<Props> = ({ scrollPosition }) => {
  const memes = useMemes()
  const [lightBoxState, setLightBoxState] = useState({
    index: 0,
    open: false,
  })

  if (!memes) {
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
            <LazyLoadImage
              src={meme.url}
              alt={meme.notes}
              width={meme.size[0] || undefined}
              height={meme.size[1] || undefined}
              scrollPosition={scrollPosition}
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

export default trackWindowScroll(MemeListView)
