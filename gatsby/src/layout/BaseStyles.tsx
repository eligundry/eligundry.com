import tw, { styled } from 'twin.macro'

import 'tailwindcss/dist/base.min.css'
import './index.css'

const BaseStyles = styled.div`
  // On computers, give some left margin
  ${tw`lg:pl-4 xl:pl-4`}

  // On mobile, add margin to the sides so the content can breathe
  ${tw`sm:px-8 md:px-8`}

  // Let's play around with colors
  ${tw`bg-pink-100`}

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
    ${tw`text-teal-500 underline`}
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

  & button {
    ${tw`bg-teal-400 p-4 text-white`}
  }
`

export const ContentWrapper = styled.main`
  // On computers, make the context 60%, full screen for mobile and templates
  ${tw`sm:w-full md:w-full lg:w-3/5 xl:w-3/5`}
`

export default BaseStyles
