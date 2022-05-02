import tw, { styled } from 'twin.macro'
import { createGlobalStyle } from 'styled-components'

// Import all the CSS files like this so that they can be inlined into a <style>
// tag. This makes the fonts load a lot faster and the text shifting is a lot
// less noticeable.
import tailwindCSS from '!!raw-loader!tailwindcss/dist/base.min.css'
import skeletonCSS from '!!raw-loader!react-loading-skeleton/dist/skeleton.css'
import fontsCSS from '!!raw-loader!./fonts.css'
import prismCSS from '!!raw-loader!./prism-material.scss'

export const GlobalStyles = createGlobalStyle`
  ${fontsCSS}
  ${tailwindCSS}
  ${skeletonCSS}
  ${prismCSS}

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

    .wf-zillaslab-n4-loading & {
      font-family: Georgia;
      letter-spacing: -0.2px;
    }
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

  .wf-firasans-n4-loading {
    h1, h2, h3 {
      font-family: Helvetica;
      letter-spacing: -0.75px;
    }
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
