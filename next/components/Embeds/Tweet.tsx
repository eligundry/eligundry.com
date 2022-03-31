import React from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import LazyLoad from 'react-lazyload'
import useDarkMode from 'use-dark-mode'

interface Props {
  id: string
}

const Tweet: React.FC<Props> = ({ id, children }) => {
  const { value: darkMode } = useDarkMode()

  return (
    <TwitterTweetEmbed
      tweetId={id}
      options={{
        theme: darkMode ? 'dark' : undefined,
      }}
      placeholder={<>{children}</>}
    />
  )
}

export const LazyLoadTweet: React.FC<Props> = ({ id, children }) => (
  <LazyLoad>
    <Tweet id={id}>{children}</Tweet>
  </LazyLoad>
)

export default Tweet
