import React from 'react'
import tw, { styled } from 'twin.macro'
import { ContentWrapper } from '../layout/BaseStyles'

const HeaderElm = styled(ContentWrapper.withComponent('header'))`
  & h1 {
    ${tw`ml-2 my-2 mx-0`}
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
    </HeaderElm>
  )
}

export default Header
