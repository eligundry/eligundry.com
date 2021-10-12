import React, { useRef, useState, useEffect } from 'react'
import tw, { styled, css } from 'twin.macro'

interface Props {
  fileURL: string
}

interface EmGitHubContainerProps {
  expanded: boolean
}

const EmGitHubContainer = styled.div<EmGitHubContainerProps>`
  ${tw`text-base`}

  ${props =>
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

  & button {
    ${tw`bg-primary hover:bg-primaryLite active:bg-primaryDark text-white px-4 py-2 rounded font-sans`}
  }
`

const GitHubFileEmbed: React.FC<Props> = ({ fileURL }) => {
  const [expanded, setExpanded] = useState(false)
  const scriptTarget = useRef<HTMLDivElement>()

  useEffect(() => {
    ;(async function() {
      if (!scriptTarget.current || scriptTarget.current.innerHTML) {
        return
      }

      // emgithub uses document.write, which doesn't work well with React post
      // render. postscribe patches document.write to document.appendChild,
      // which makes it work with this effect.
      const postscribe = (await import('postscribe')).default
      const query = new URLSearchParams({
        target: fileURL,
        style: 'github-gist',
        showBorder: 'on',
        showLineNumbers: 'on',
        showFileMeta: 'on',
      })

      postscribe(
        scriptTarget.current,
        `<script async cross-origin="anonymous" src="https://emgithub.com/embed.js?${query.toString()}"></script>`
      )
    })()
  }, [scriptTarget.current, fileURL])

  return (
    <>
      <EmGitHubContainer ref={scriptTarget} expanded={expanded} />
      {!expanded && (
        <ExpandButtonContainer>
          <button onClick={() => setExpanded(true)}>Expand File</button>
        </ExpandButtonContainer>
      )}
    </>
  )
}

export default GitHubFileEmbed
