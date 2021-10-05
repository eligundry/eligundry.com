import React from 'react'
import tw, { styled } from 'twin.macro'
import useWindowScroll from 'react-use/lib/useWindowScroll'

import Nav from './Nav'

const HeaderElm = styled.header<{ transparent: boolean }>`
  ${tw`fixed w-full z-10 top-0`}

  ${props => !props.transparent && tw`bg-white`}

  & .wrapper {
    ${tw`w-full md:max-w-4xl mx-auto flex flex-wrap items-center justify-between mt-0 py-3`}
  }

  & h1 {
    ${tw`pl-4`}

    & a {
      ${tw`
        text-gray-900 
        hover:text-primary 
        text-base 
        no-underline 
        hover:no-underline 
        font-extrabold 
        text-xl
      `}
    }
  }
`

const Header: React.FC = () => {
  const { y } = useWindowScroll()

  return (
    <HeaderElm transparent={y === 0}>
      <div className="wrapper">
        <h1 itemProp="name">
          <a rel="root" href="/" itemProp="sameAs">
            Eli Gundry
          </a>
        </h1>
        <Nav />
      </div>
    </HeaderElm>
  )
}

export default Header
