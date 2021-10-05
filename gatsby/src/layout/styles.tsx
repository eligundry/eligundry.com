import tw, { styled } from 'twin.macro'
import { createGlobalStyle } from 'styled-components'

import 'tailwindcss/dist/base.min.css'
import './index.css'

export const GlobalStyles = createGlobalStyle`
  body {
    ${tw`
      bg-gray-100 
      print:bg-transparent 
      font-serif 
      leading-normal 
      tracking-normal
    `}
  }

  #___gatsby #gatsby-focus-wrapper {
    min-height: 100vh;
    min-width: 100vw;
  }

  h1 {
    ${tw`text-2xl font-sans font-bold text-3xl`}
  }

  h2 {
    ${tw`text-xl font-sans font-bold`}
  }

  h3 {
    ${tw`text-lg font-sans font-bold`}
  }

  ul {
    ${tw`list-disc pl-8 my-4`}

    & ul, & ol {
      ${tw`mt-0 mb-0`}
    }
  }

  ol {
    ${tw`list-decimal pl-8 my-4`}

    & ul, & ol {
      ${tw`mt-0 mb-0`}
    }
  }

  blockquote {
    ${tw`border-l-4 border-primary italic my-8 pl-8 md:pl-12`}
  }

  a {
    ${tw`text-primary hover:underline focus:underline`}
  }

  p {
    ${tw`my-4`}
  }

  address {
    ${tw`not-italic`}
  }
`

interface ContentWrapperProps {
  wider: boolean
}

export const ContentWrapper = styled.main<ContentWrapperProps>`
  ${tw`w-full md:max-w-3xl mx-auto pt-20`}
`
