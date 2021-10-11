import React, { useState, useEffect } from 'react'
import tw, { styled } from 'twin.macro'
import useWindowScroll from 'react-use/lib/useWindowScroll'
import useWindowSize from 'react-use/lib/useWindowSize'

import Nav from './Nav'

const HeaderElm = styled.header<{ transparent: boolean }>`
  ${tw`
    fixed 
    print:relative
    w-full 
    z-10 
    top-0 
    bg-transparent
    sm:bg-white
    sm:shadow
    transition-all 
    duration-200
  `}

  ${props =>
    !props.transparent
      ? tw`bg-white shadow print:shadow-none print:bg-transparent`
      : tw`bg-transparent lg:bg-transparent`}

  & .wrapper {
    ${tw`
      w-full 
      md:max-w-3xl 
      mx-auto 
      flex 
      flex-wrap 
      flex-row
      items-center 
      sm:flex-col
      sm:items-start
      justify-between 
      mt-0 
      py-3
      sm:px-4
    `}

    margin-top: -1.5rem;
  }

  & h1 {
    & a {
      ${tw`
        text-typographyDark
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

const ProgressBar = styled.progress`
  ${tw`h-1 z-20 top-0 print:hidden`}

  vertical-align: top;
  width: 100%;

  &[value]::-webkit-progress-bar {
    ${tw`bg-gray-200`}
  }

  &[value]::-webkit-progress-value {
    ${tw`bg-primary`}
  }
`

const Header: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const { y } = useWindowScroll()
  const { height } = useWindowSize()

  useEffect(() => {
    setScrollProgress(
      Math.round(
        Math.min((y / (document.body.clientHeight - height)) * 100, 100)
      )
    )
  }, [y, height])

  return (
    <HeaderElm transparent={scrollProgress === 0}>
      <ProgressBar
        max="100"
        value={scrollProgress}
        aria-label="your scroll progress through the page"
      />
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
