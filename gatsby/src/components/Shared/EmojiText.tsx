import React from 'react'
import tw, { styled } from 'twin.macro'

interface Props {
  emoji: string
  label: string
}

const Emoji = styled.span`
  ${tw`pr-2`}
`

const EmojiText: React.FC<Props> = ({ children, emoji, label }) => (
  <>
    <Emoji role="img" aria-label={label}>
      {emoji}
    </Emoji>
    {children}
  </>
)

export default EmojiText
