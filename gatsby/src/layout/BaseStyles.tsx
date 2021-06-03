import tw, { styled, css } from 'twin.macro'

import 'tailwindcss/dist/base.min.css'
import './index.css'

const BaseStyles = styled.div`
  // On computers, give some left margin
  ${tw`lg:pl-4 xl:pl-4`}

  // On mobile, add margin to the sides so the content can breathe
  ${tw`xs:px-2 sm:px-4 md:px-4`}

  & h1 {
    ${tw`text-2xl`}
  }

  & h2 {
    ${tw`text-xl`}
  }

  & h3 {
    ${tw`text-lg`}
  }

  & ul {
    ${tw`list-disc pl-8 my-4`}

    & ul, & ol {
      ${tw`mt-0 mb-0`}
    }
  }

  & ol {
    ${tw`list-decimal pl-8 my-4`}

    & ul, & ol {
      ${tw`mt-0 mb-0`}
    }
  }

  & blockquote {
    ${tw`italic border-l-2 border-teal-400 pl-2`}
  }

  & a {
    ${tw`text-teal-500 hover:underline focus:underline`}
  }

  & p {
    ${tw`my-4`}
  }

  & address {
    ${tw`not-italic`}
  }

  ${tw`print:bg-transparent`}
`

interface ContentWrapperProps {
  wider: boolean
}

export const ContentWrapper = styled.main<ContentWrapperProps>`
  // On computers, make the context 60%, full screen for mobile and templates
  ${tw`xs:w-full sm:w-full md:w-full lg:w-4/5 xl:w-3/5`}

  ${props => props.wider && tw`lg:w-4/5 xl:w-4/5`}
`

export default BaseStyles
