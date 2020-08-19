import tw, { styled } from 'twin.macro'

import 'tailwindcss/dist/base.min.css'
import './index.css'

const BaseStyles = styled.div`
  ${tw`container`}

  margin: 0 auto;

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
    ${tw`list-disc pl-8`}
  }

  & ol {
    ${tw`list-decimal pl-8`}
  }

  & a {
    ${tw`text-blue-600 underline`}
  }

  & p {
    ${tw`my-4`}
  }
`

export default BaseStyles
