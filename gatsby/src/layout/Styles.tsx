import React from 'react'
import tw, { styled, theme } from 'twin.macro'
import { createGlobalStyle } from 'styled-components'
import Helmet from 'react-helmet'

import 'tailwindcss/dist/base.min.css'
import './prism-material-light.css'

export const GlobalStyles = createGlobalStyle`
  #___gatsby #gatsby-focus-wrapper {
    min-height: 100vh;
    min-width: 100vw;
  }

  body {
    ${tw`bg-cream bg-opacity-10 print:bg-transparent font-sans`}
  }

  h1 {
    ${tw`text-3xl font-mono`}
  }

  h2 {
    ${tw`text-2xl font-mono`}
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
    ${tw`italic border-l-2 border-green pl-2`}
  }

  a {
    ${tw`text-red hover:underline focus:underline`}

    text-decoration-color: ${theme`colors.green`};
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

    & .token.comment {
      ${tw`italic`}
    }
  }
`

export const ContentWrapper = styled.main<Record<string, any>>`
  // On computers, make the context 60%, full screen for mobile and templates
  ${tw`xs:w-full sm:w-full md:w-full lg:w-1/2 xl:w-1/2 print:w-11/12`}

  margin: 0 auto;
`

const Styles: React.FC = () => (
  <>
    <Helmet>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap"
        rel="stylesheet"
      />
    </Helmet>
    <GlobalStyles />
  </>
)

export default Styles
