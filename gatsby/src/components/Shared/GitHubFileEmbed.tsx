import React, { useRef } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import postscribe from 'postscribe'

interface Props {
  fileURL: string
}

const GitHubFileEmbed: React.FC<Props> = ({ fileURL }) => {
  const scriptTarget = useRef<HTMLDivElement>()

  useEffectOnce(() => {
    if (!scriptTarget.current) {
      return
    }

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
  })

  return <div ref={scriptTarget} />
}

export default GitHubFileEmbed
