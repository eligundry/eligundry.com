import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'

import { usePrefersDarkMode } from '@/components/Layout/ThemeModeProvider'
import styles from './index.module.scss'

interface Props {
  fileURL: string
}

const GitHubFileEmbed: React.FC<Props> = ({ fileURL }) => {
  const [expanded, setExpanded] = useState(false)
  const scriptTarget = useRef<HTMLDivElement>()
  const prefersDark = usePrefersDarkMode()
  const rendered = !!scriptTarget

  useEffect(() => {
    if (!scriptTarget.current || scriptTarget.current.innerHTML) {
      return
    }

    const script = scriptTarget.current

    // emgithub uses document.write, which doesn't work well with React post
    // render. postscribe patches document.write to document.appendChild,
    // which makes it work with this effect.
    const query = new URLSearchParams({
      target: fileURL,
      style: prefersDark ? 'tomorrow-night' : 'github-gist',
      showBorder: 'on',
      showLineNumbers: 'on',
      showFileMeta: 'on',
    })

    // @ts-ignore
    import('postscribe').then(({ default: postscribe }) =>
      postscribe(
        scriptTarget.current,
        `<script async cross-origin="anonymous" src="https://emgithub.com/embed.js?${query.toString()}"></script>`
      )
    )

    /* eslint-disable-next-line consistent-return */
    return function cleanup() {
      script.innerHTML = ''
    }
  }, [rendered, fileURL, prefersDark])

  return (
    <div>
      <div
        ref={scriptTarget as React.MutableRefObject<HTMLDivElement>}
        className={clsx(
          styles.container,
          !expanded && styles.containerCollapsed
        )}
      />
      {!expanded && (
        <div className={clsx(styles.expandButtonContainer)}>
          <button
            onClick={() => setExpanded(true)}
            data-gtm="emgithub-file-expaded"
            data-gtm-emgithub-file-url={fileURL}
            type="button"
            className={clsx(styles.expandButton)}
          >
            Expand File
          </button>
        </div>
      )}
    </div>
  )
}

export default GitHubFileEmbed
