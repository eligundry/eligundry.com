import React from 'react'
import tw, { styled } from 'twin.macro'

interface Props {
  emoji: string
  label: string
  fallback?: React.ReactNode
}

const Emoji = styled.span`
  ${tw`pr-2`}
`

const EmojiText: React.FC<Props> = ({ children, emoji, label, fallback }) => {
  if (fallback) {
    return (
      <>
        {fallback} {children}
      </>
    )
  }

  return (
    <>
      <Emoji role="img" aria-label={label}>
        {emoji}
      </Emoji>
      {children}
    </>
  )
}

export default EmojiText
