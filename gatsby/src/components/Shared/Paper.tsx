import React from 'react'
import tw, { styled } from 'twin.macro'

export const PaperStyles = tw`
  rounded 
  shadow 
  p-6 
  mb-4 
  bg-white 
  sm:mx-2 
  md:mx-2
`

const Paper = styled.div`
  ${PaperStyles}

  @media print {
    ${tw`shadow-none`}
  }
`

Paper.article = Paper.withComponent('article')
Paper.section = Paper.withComponent('section')

export default Paper
