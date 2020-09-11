import React, { useState } from 'react'
import tw, { styled, css } from 'twin.macro'

const HeaderElm = styled.header`
  ${tw`ml-6`}

  & h1 {
    margin: 0.25em 0;
  }
`

const Header: React.FC = () => {
  return (
    <>
      <HeaderElm>
        <h1>
          <a rel="root" href="/">
            Eli Gundry
          </a>
        </h1>
      </HeaderElm>
    </>
  )
}

export default Header
