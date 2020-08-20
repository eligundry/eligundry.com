import React from 'react'
import tw, { styled } from 'twin.macro'

export const BoxStyles = tw`rounded shadow p-6 mb-4 bg-white sm:mx-2 md:mx-2`
console.log(BoxStyles)

const Box = styled.div`
  ${BoxStyles}
`

export default Box
