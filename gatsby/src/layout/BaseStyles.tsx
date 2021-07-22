import tw, { styled, theme } from 'twin.macro'
import { createGlobalStyle } from 'styled-components'

import 'tailwindcss/dist/base.min.css'
import './index.css'

export const GlobalStyles = createGlobalStyle`
  #___gatsby #gatsby-focus-wrapper {
    min-height: 100vh;
    min-width: 100vw;
  }

  body {
    ${tw`bg-cream bg-opacity-10 print:bg-transparent`};

    // On computers, give some left margin
    ${tw`lg:pl-4 xl:pl-4`}

    // On mobile, add margin to the sides so the content can breathe
    ${tw`xs:px-2 sm:px-4 md:px-4`}
  }

  h1 {
    ${tw`text-2xl font-mono`}
  }

  h2 {
    ${tw`text-xl font-mono`}
  }

  h3 {
    ${tw`text-lg font-mono`}
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
    ${tw`text-red hover:underline focus:underline`}

    text-decoration-color: ${theme`colors.green`} 
  }

  p {
    ${tw`my-4`}
  }

  address {
    ${tw`not-italic`}
  }

  code,
  pre {
    ${tw`font-mono`}
  }
`

export const ContentWrapper = styled.main`
  // On computers, make the context 60%, full screen for mobile and templates
  ${tw`xs:w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2`}

  margin: 0 auto;
`

export default GlobalStyles
