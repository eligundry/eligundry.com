import React, { useEffect, useRef } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import tw, { styled } from 'twin.macro'

const UtterancesContainer = styled.aside`
  & .utterances {
    ${tw`m-0`}
  }
`

const Comments: React.FC = () => {
  const utterancesRef = useRef<HTMLDivElement>(null)

  useEffectOnce(() => {
    const scriptElem = document.createElement('script')
    scriptElem.src = 'https://utteranc.es/client.js'
    scriptElem.async = true
    scriptElem.crossOrigin = 'anonymous'
    scriptElem.setAttribute('repo', 'eligundry/eligundry.com')
    scriptElem.setAttribute('issue-term', 'pathname')
    scriptElem.setAttribute('label', '✨💬✨  Blog')
    scriptElem.setAttribute('theme', 'github-light')
    utterancesRef.current?.appendChild(scriptElem)
  })

  return <UtterancesContainer ref={utterancesRef} />
}

export default Comments
