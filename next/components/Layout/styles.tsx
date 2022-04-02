import tw, { styled } from 'twin.macro'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark light;
  }

  body {
    ${tw`
      bg-siteBackground
      print:bg-transparent 
      font-serif 
      leading-normal 
      tracking-normal
    `}

    // Dark mode specific overrides
    &.dark {
      ${tw`bg-black text-white`}
    }
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
    ${tw`pl-8 my-4`}

    list-style: square;

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

  code {
    ${tw`font-mono`}
  }

  pre[class*="language-"] {
    ${tw`text-base`}
  }
`

export const ContentWrapper = styled.main`
  ${tw`
    w-full 
    md:max-w-3xl 
    mx-auto 
    pt-20 
    sm:pt-12
    mt-6 
    print:mt-0
    print:pt-0
  `}

  @media (min-width: 768px) {
    max-width: 50rem;
  }
`