import React from 'react'
import useMedia from 'react-use/lib/useMedia'
import tw, { styled } from 'twin.macro'
import EmojiText from '../Shared/EmojiText'

const Footer = styled.footer`
  ${tw`fixed bottom-0 flex flex-row w-full border-t-2 font-sans font-bold`}

  & > * {
    ${tw`mr-4`}
  }

  & svg {
    ${tw`inline`}
  }
`

const ResumeFooter: React.FC = () => {
  const isPrinting = useMedia('print')

  if (!isPrinting) {
    return null
  }

  return (
    <Footer>
      <span>
        <EmojiText
          emoji="💌"
          label="envelop with heart because you will love emailing me"
        >
          <a href="mailto:eligundry@gmail.com">eligundry@gmail.com</a>
        </EmojiText>
      </span>
      <span>
        <EmojiText emoji="📞" label="call me maybe">
          <a href="tel:3475232652">347.523.2652</a>
        </EmojiText>
      </span>
      <address>
        <EmojiText emoji="📍" label="drop a pin cause I am in Astoria">
          Astoria, NY
        </EmojiText>
      </address>
      <span>
        <EmojiText emoji="👨‍💻" label="lil man at computer because i'm coding">
          <a href="https://github.com/eligundry">github/eligundry</a>
        </EmojiText>
      </span>
    </Footer>
  )
}

export default ResumeFooter
