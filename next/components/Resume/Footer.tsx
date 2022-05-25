import React from 'react'
import clsx from 'clsx'

import EmojiText from '@/components/Shared/EmojiText'
import { useIsPrinting } from '@/hooks/useMediaQuery'
import { useParseOptimizedFlag, useJobSearchParams } from './hooks'
import styles from './index.module.scss'

const ResumeFooter: React.FC = () => {
  const isPrinting = useIsPrinting()
  const parseOptimized = useParseOptimizedFlag()
  const targeting = useJobSearchParams({
    content: `${parseOptimized ? 'header' : 'footer'}-website-link`,
  })

  if (!isPrinting) {
    return null
  }

  return (
    <footer
      className={clsx(
        styles.resumeFooter,
        parseOptimized
          ? styles.parseOptimizedResumeFooter
          : styles.notParseOptimizedResumeFooter
      )}
    >
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
    </footer>
  )
}

export default ResumeFooter
