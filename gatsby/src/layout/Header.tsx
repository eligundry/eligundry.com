import React from 'react'
import tw, { styled } from 'twin.macro'
import { ContentWrapper } from '../layout/BaseStyles'

const HeaderElm = styled(ContentWrapper.withComponent('header'))`
  ${tw`font-mono`}

  & h1 {
    ${tw`ml-2 my-2 mx-0`}
  }

  & h2 {
    & .comment {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`

const Header: React.FC = () => {
  return (
    <HeaderElm>
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
