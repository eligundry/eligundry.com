import React from 'react'
import { useQuery } from 'react-query'

import { Meme } from './types'

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

  if (isFetching || error) {
    return null
  }

  return (
    <>
      {memes.map(meme => (
        <img key={`meme-${meme.id}`} src={meme.url} alt="" />
      ))}
    </>
  )
}

export default MemeListView
