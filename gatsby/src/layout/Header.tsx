import React from 'react'
import tw, { styled } from 'twin.macro'

const HeaderElm = styled.header`
  ${tw`ml-6 print:ml-2`}

  & h1 {
    ${tw`my-2 mx-0`}
  }
`

const Header: React.FC = () => {
  return (
    <>
      <HeaderElm>
        <h1 itemProp="name">
          <a rel="root" href="/">
            Eli Gundry
          </a>
        </h1>
      </HeaderElm>
    </>
  )
}

export default Header
