import React from 'react'
import tw, { styled } from 'twin.macro'
import useWindowScroll from 'react-use/lib/useWindowScroll'
import useWindowSize from 'react-use/lib/useWindowSize'

import Nav from './Nav'
import useDocument from '../components/Shared/useDocument'

const HeaderElm = styled.header<{ transparent: boolean }>`
  ${tw`
    fixed 
    print:relative
    w-full 
    z-10 
    top-0 
    bg-transparent
    sm:bg-white
    sm:dark:bg-typographyDark
    sm:shadow
    transition-all 
    duration-200
  `}

  ${(props) =>
    !props.transparent
      ? tw`bg-white dark:bg-typographyDark shadow print:shadow-none print:bg-transparent`
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
        dark:text-white
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
    ${tw`bg-liteGray dark:bg-typographyLite`}
  }

  &[value]::-webkit-progress-value {
    ${tw`bg-primary`}
  }
`

const Header: React.FC = () => {
  const { y } = useWindowScroll()
  const { height } = useWindowSize()
  const document = useDocument()

  return (
    <HeaderElm transparent={y === 0}>
      <ProgressBar
        max={Math.max(document?.body?.clientHeight ?? 0, height + 1) - height}
        value={y}
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
