import React from 'react'
import tw, { styled } from 'twin.macro'

import useIsPrinting from '../Shared/useIsPrinting'

const Header = styled.header`
  ${tw`flex flex-row`}

  border: 0 !important;

  & h1 a {
    ${tw`text-typographyDark text-2xl font-extrabold`}
  }

  && h2 {
    ${tw`text-primary text-sm`}
    margin-top: 10px;

    & .comment {
      ${tw`text-typographyLite`}
    }
  }
`

const ResumeHeader: React.FC = () => {
  const isPrinting = useIsPrinting()

  if (!isPrinting) {
    return null
  }

  return (
    <Header>
      <h1>
        <a href="/">Eli Gundry</a>
      </h1>
      <h2>
        <code>
          Full Stack Web Engineer{' '}
          <span className="token comment">
            // ❤️ Javascript, Devops && Web Standards
          </span>
        </code>
      </h2>
    </Header>
  )
}

export default ResumeHeader
