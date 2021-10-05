import tw, { styled, css } from 'twin.macro'
import { createGlobalStyle } from 'styled-components'

import 'tailwindcss/dist/base.min.css'
import './index.css'

export const GlobalStyles = createGlobalStyle`
  body {
    ${tw`bg-gray-100 print:bg-transparent font-serif leading-normal tracking-normal`}
  }

  #___gatsby #gatsby-focus-wrapper {
    min-height: 100vh;
    min-width: 100vw;
  }

  h1 {
    ${tw`text-2xl font-sans`}
  }

  h2 {
    ${tw`text-xl font-sans`}
  }

  h3 {
    ${tw`text-lg font-sans`}
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
    ${tw`italic border-l-2 border-teal-400 pl-2`}
  }

  a {
    ${tw`text-teal-500 hover:underline focus:underline`}
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
  ${tw` w-full md:max-w-3xl mx-auto pt-20`}
`
