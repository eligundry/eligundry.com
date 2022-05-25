import React from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { useIsPrinting } from '@/hooks/useMediaQuery'
import { useParseOptimizedFlag } from './hooks'
import ResumeFooter from './Footer'
import styles from './index.module.scss'

const ResumeHeader: React.FC = () => {
  const isPrinting = useIsPrinting()
  const parseOptimized = useParseOptimizedFlag()

  if (!isPrinting) {
    return null
  }

  return (
    <header
      className={clsx(
        styles.resumeHeader,
        parseOptimized && styles.parseOptimizedResumeHeader
      )}
    >
      <h1>
        <Link href="/">
          <a>Eli Gundry</a>
        </Link>
      </h1>
      <div>
        <h2>
          <code>
            Full Stack Web Engineer{' '}
            <span className="token comment">
              {`// ${
                !parseOptimized && '❤️ '
              }Javascript, Devops && Web Standards`}
            </span>
          </code>
        </h2>
        {parseOptimized && <ResumeFooter />}
      </div>
    </header>
  )
}

export default ResumeHeader
