import React, { useRef, useState, useEffect } from 'react'
import tw, { styled, css } from 'twin.macro'

import { usePrefersDarkMode } from '../../layout/ThemeModeProvider'

interface Props {
  fileURL: string
}

interface EmGitHubContainerProps {
  expanded: boolean
}

const EmGitHubContainer = styled.div<EmGitHubContainerProps>`
  ${tw`text-base`}

  ${(props) =>
    !props.expanded &&
    css`
      max-height: 200px;
      overflow: hidden;
    `}
`

const ExpandButtonContainer = styled.div`
  position: relative;
  top: -3em;
  height: 3em;
  background-image: linear-gradient(to bottom, transparent, white);
  display: flex;
  justify-content: center;

  ${tw`dark:bg-none`}

  & button {
    ${tw`bg-primary hover:bg-primaryLite active:bg-primaryDark text-white px-4 py-2 rounded font-sans`}
  }
`

const GitHubFileEmbed: React.FC<Props> = ({ fileURL }) => {
  const [expanded, setExpanded] = useState(false)
  const scriptTarget = useRef<HTMLDivElement>()
  const prefersDark = usePrefersDarkMode()

  useEffect(() => {
    if (!scriptTarget.current || scriptTarget.current.innerHTML) {
      return
    }

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
      if (scriptTarget.current) {
        scriptTarget.current.innerHTML = ''
      }
    }
  }, [!!scriptTarget.current, fileURL, prefersDark])

  return (
    <>
      <EmGitHubContainer
        ref={scriptTarget as React.MutableRefObject<HTMLDivElement>}
        expanded={expanded}
      />
      {!expanded && (
        <ExpandButtonContainer>
          <button
            onClick={() => setExpanded(true)}
            data-gtm="emgithub-file-expaded"
            data-gtm-emgithub-file-url={fileURL}
            type="button"
          >
            Expand File
          </button>
        </ExpandButtonContainer>
      )}
    </>
  )
}

export default GitHubFileEmbed
