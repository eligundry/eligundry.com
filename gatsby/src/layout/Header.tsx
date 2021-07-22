import React, { useState } from 'react'
import tw, { styled, theme, css } from 'twin.macro'
import useTimeoutFn from 'react-use/lib/useTimeoutFn'

import { ContentWrapper } from '../layout/Styles'

const HeaderElm = styled<{ animate?: boolean }>(
  ContentWrapper.withComponent('header')
)`
  ${tw`font-mono pl-8 mb-2`}

  & h1 {
    ${tw`ml-2 my-2 mx-0`}

    & a {
      ${tw`text-green`}
    }
  }

  & h2 {
    ${tw`text-orange`}

    & .comment {
      ${tw`sm:hidden xs:hidden`}
      color: rgba(0, 0, 0, 0.5);
    }
  }

  // Make this look like it was typed out
  // https://css-tricks.com/snippets/css/typewriter-effect/
  ${props =>
    props.animate &&
    css`
      @media screen and (min-width: ${theme`screens.sm.max`}) and (prefers-reduced-motion: no-preference) {
        & h2 {
          display: inline-block;
          overflow: hidden;
          border-right: 0.15em solid ${theme`colors.orange`};
          white-space: nowrap;
          animation: typing 3s steps(40, end), blink-caret 1s step-end infinite;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 719px;
          }
        }

        @keyframe blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: ${theme`colors.orange`};
          }
        }
      }
    `}
`

const Header: React.FC = () => {
  // @TODO Figure out how we want to persist this.
  const [animate, setAnimate] = useState(true)
  useTimeoutFn(() => setAnimate(false), 5000)

  return (
    <HeaderElm animate={animate}>
      <h1 itemProp="name">
        <a rel="root" href="/" itemProp="sameAs">
          Eli Gundry
        </a>
      </h1>
      <h2>
        Full Stack Engineer{' '}
        <span className="comment">
          // ❤️ Javascript, Devops & Web Standards
        </span>
      </h2>
    </HeaderElm>
  )
}

export default Header
