import React from 'react'
import TweetEmbed from 'react-tweet-embed'
import useDarkMode from 'use-dark-mode'

interface Props {
  id: string
}

const Tweet: React.FC<Props> = ({ id }) => {
  const { value: darkMode } = useDarkMode()

  return (
    <TweetEmbed
      tweetId={id}
      options={{
        theme: darkMode ? 'dark' : undefined,
      }}
    />
  )
}

export default Tweet
