import React from 'react'
import tw, { styled } from 'twin.macro'

export const PaperStyles = tw`rounded shadow p-6 mb-4 bg-white sm:mx-2 md:mx-2`

const PaperDiv = styled.div`
  ${PaperStyles}
`

export const PaperArticle = styled.article`
  ${PaperStyles}
`

export const PaperSection = styled.section`
  ${PaperStyles}
`

export default PaperDiv
