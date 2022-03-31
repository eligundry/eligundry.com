import React, { useEffect, useRef } from 'react'
import tw, { styled } from 'twin.macro'

import { usePrefersDarkMode } from '@/components/Layout/ThemeModeProvider'

const UtterancesContainer = styled.aside`
  & .utterances {
    ${tw`m-0 print:hidden`}
  }
`

const Comments: React.FC = () => {
  const utterancesRef = useRef<HTMLDivElement>(null)
  const prefersDark = usePrefersDarkMode()

  useEffect(() => {
    if (!utterancesRef.current) {
      return
    }

    const utterancesElm = utterancesRef.current
    const scriptElem = document.createElement('script')
    scriptElem.src = 'https://utteranc.es/client.js'
    scriptElem.async = true
    scriptElem.crossOrigin = 'anonymous'
    scriptElem.setAttribute('repo', 'eligundry/eligundry.com')
    scriptElem.setAttribute('issue-term', 'pathname')
    scriptElem.setAttribute('label', '✨💬✨  Blog')
    scriptElem.setAttribute('theme', `github-${prefersDark ? 'dark' : 'light'}`)
    utterancesElm.appendChild(scriptElem)

    /* eslint-disable-next-line consistent-return */
    return function cleanup() {
      utterancesElm.innerHTML = ''
    }
  }, [prefersDark])

  return <UtterancesContainer ref={utterancesRef} />
}

export default Comments
