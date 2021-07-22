import React from 'react'
import tw, { styled, theme } from 'twin.macro'
import { ContentWrapper } from '../layout/BaseStyles'

const HeaderElm = styled(ContentWrapper.withComponent('header'))`
  ${tw`font-mono pl-8`}

  & h1 {
    ${tw`ml-2 my-2 mx-0`}

    & a {
      ${tw`text-green`}
    }
  }

  & h2 {
    ${tw`text-orange`}

    & .comment {
      color: rgba(0, 0, 0, 0.5);
    }
  }

  // Make this look like it was typed out
  // https://css-tricks.com/snippets/css/typewriter-effect/
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
      width: 100%;
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
`

const Header: React.FC = () => (
  <HeaderElm>
    <h1 itemProp="name">
      <a rel="root" href="/" itemProp="sameAs">
        Eli Gundry
      </a>
    </h1>
    <h2>
      Full Stack Engineer{' '}
      <span className="comment">// ❤️ Javascript, Devops & Web Standards</span>
    </h2>
  </HeaderElm>
)

export default Header
