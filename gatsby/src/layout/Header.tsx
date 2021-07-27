import React, { useEffect } from 'react'
import tw, { styled, theme, css } from 'twin.macro'
import useTimeoutFn from 'react-use/lib/useTimeoutFn'
import useMeasure from 'react-use/lib/useMeasure'

import Paper from '../components/Shared/Paper'
import { useUserInterfaceState } from '../components/State/UserInterfaceState'

const HeaderElm = styled<{ animate?: boolean }>(Paper.withComponent('header'))`
  ${tw`font-mono mt-2`}

  & h1 {
    ${tw`ml-2 my-2 mx-0 font-bold`}

    & a {
      ${tw`text-green`}
    }
  }

  & h2 {
    ${tw`text-orange text-base inline-block`}

    & .comment {
      ${tw`sm:hidden xs:hidden print:inline`}
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
            width: 573px;
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
  const [ref, { right: width, x: padding }] = useMeasure()
  const { animateHeader, updateState } = useUserInterfaceState()

  // Only allow the header to be animated on the first page load
  useTimeoutFn(() => updateState({ animateHeader: false }), 5000)

  useEffect(() => updateState({ headerWidth: width + padding }), [
    width,
    padding,
    updateState,
  ])

  return (
    <HeaderElm animate={animateHeader} ref={ref}>
      <h1 itemProp="name">
        <a rel="root" href="/" itemProp="sameAs">
          Eli Gundry
        </a>
      </h1>
      <h2>
        <span className="token comment">$ </span>
        Full Stack Engineer{' '}
        <span className="token comment">
          // ❤️ Javascript, Devops & Web Standards
        </span>
      </h2>
    </HeaderElm>
  )
}

export default Header
