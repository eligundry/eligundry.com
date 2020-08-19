import React from 'react'
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
    ${tw`list-disc`}
  }

  & ol {
    ${tw`list-decimal`}
  }

  & a {
    ${tw`text-blue-600 underline`}
  }

  & p {
    ${tw`my-4`}
  }
`

export default BaseStyles
