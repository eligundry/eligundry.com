import React from 'react'
import tw, { styled, css } from 'twin.macro'

import useIsPrinting from '../Shared/useIsPrinting'
import { useParseOptimizedFlag } from './hooks'
import ResumeFooter from './Footer'

const Header = styled.header<{ parseOptimized?: boolean }>`
  ${tw`flex flex-row`}

  border: 0 !important;

  & h1 a {
    ${tw`text-typographyDark text-2xl font-extrabold`}
  }

  && h2 {
    ${tw`text-primary text-sm`}
    ${(props) =>
      !props.parseOptimized &&
      css`
        margin-top: 10px;
      `}

    & .comment {
      ${tw`text-typographyLite`}
    }
  }
`

const ResumeHeader: React.FC = () => {
  const isPrinting = useIsPrinting()
  const parseOptimized = useParseOptimizedFlag()

  if (!isPrinting) {
    return null
  }

  return (
    <Header parseOptimized={parseOptimized}>
      <h1>
        <a href="/">Eli Gundry</a>
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
    </Header>
  )
}

export default ResumeHeader
