import React from 'react'
import useMedia from 'react-use/lib/useMedia'
import tw, { styled } from 'twin.macro'

import EmojiText from '../Shared/EmojiText'
import { useParseOptimizedFlag, useJobSearchParams } from './hooks'

const Footer = styled.footer<{ parseOptimized?: boolean }>`
  ${tw`flex flex-row w-full font-sans font-bold text-xs`}

  ${(props) =>
    props.parseOptimized
      ? tw`print:font-parseSafeSans pb-2 justify-end`
      : tw`fixed bottom-0 border-t-2 pt-2`}

  & > * {
    ${tw`mr-4`}

    &:last-child {
      ${tw`mr-0`}
    }
  }

  & svg {
    ${tw`inline`}
  }
`

const ResumeFooter: React.FC = () => {
  const isPrinting = useMedia('print')
  const parseOptimized = useParseOptimizedFlag()
  const targeting = useJobSearchParams({
    content: `${parseOptimized ? 'header' : 'footer'}-website-link`,
  })

  if (!isPrinting) {
    return null
  }

  return (
    <Footer parseOptimized={parseOptimized}>
      <span>
        <EmojiText
          emoji="💌"
          label="envelop with heart because you will love emailing me"
          fallback={parseOptimized && <span>Email: </span>}
        >
          <a href="mailto:eligundry@gmail.com">eligundry@gmail.com</a>
        </EmojiText>
      </span>
      <span>
        <EmojiText
          emoji="📞"
          label="call me maybe"
          fallback={parseOptimized && <span>Phone: </span>}
        >
          <a href="tel:3475232652">347.523.2652</a>
        </EmojiText>
      </span>
      <address>
        <EmojiText
          emoji="📍"
          label="drop a pin cause I am in Astoria"
          fallback={parseOptimized && <span>Location: </span>}
        >
          Astoria, NY
        </EmojiText>
      </address>
      <span>
        <EmojiText
          emoji="💾"
          label="floppy disk that my website is saved on"
          fallback={parseOptimized && <span>Web: </span>}
        >
          <a href={`https://eligundry.com?${targeting.toString()}`}>
            eligundry.com
          </a>
        </EmojiText>
      </span>
      {!parseOptimized && (
        <span>
          <EmojiText
            emoji="👨‍💻"
            label="lil man at computer because i'm coding"
            fallback={parseOptimized && <span>GH: </span>}
          >
            <a href="https://github.com/eligundry">github/eligundry</a>
          </EmojiText>
        </span>
      )}
    </Footer>
  )
}

export default ResumeFooter
