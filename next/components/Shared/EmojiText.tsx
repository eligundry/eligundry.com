import React from 'react'

interface Props {
  emoji: string
  label: string
  fallback?: React.ReactNode
}

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
      <span role="img" aria-label={label} className="pr-2">
        {emoji}
      </span>
      {children}
    </>
  )
}

export default EmojiText
