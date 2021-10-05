import tw, { styled } from 'twin.macro'

export const PaperStyles = tw`
`

const Paper = styled.div`
  ${tw`
    w-full 
    px-4 
    pb-10
    md:px-6 
    text-xl 
    text-gray-800 
    leading-normal
  `}
`

Paper.article = Paper.withComponent('article')
Paper.section = Paper.withComponent('section')
Paper.figure = Paper.withComponent('figure')

export default Paper
