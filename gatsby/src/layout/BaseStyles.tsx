import tw, { styled, css } from 'twin.macro'

import 'tailwindcss/dist/base.min.css'
import './index.css'

const BaseStyles = styled.div`
  // On computers, give some left margin
  ${tw`lg:pl-4 xl:pl-4`}

  // On mobile, add margin to the sides so the content can breathe
  ${tw`sm:px-8 md:px-8`}

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
  }

  & ol {
    ${tw`list-decimal pl-8 my-4`}
  }

  & a {
    ${tw`text-teal-500 hover:underline focus:underline`}
  }

  & p {
    ${tw`my-4`}
  }

  & input,
  & textarea {
    ${tw`border-2 border-gray-500 rounded`}

    &:active,
    &:focus {
      ${tw`border-teal-400 outline-none`}
    }
  }

  @media print {
    ${tw`bg-transparent`}
  }
`

interface ContentWrapperProps {
  wider: boolean
}

export const ContentWrapper = styled.main<ContentWrapperProps>`
  // On computers, make the context 60%, full screen for mobile and templates
  ${tw`sm:w-full md:w-full lg:w-1/2 xl:w-1/2`}

  ${props => props.wider && tw`lg:w-4/5 xl:w-4/5`}
`

export default BaseStyles
