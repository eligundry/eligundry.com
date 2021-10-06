import tw, { styled } from 'twin.macro'

export const PaperStyles = tw`
`

const Paper = styled.div`
  ${tw`
    w-full 
    pb-10
    sm:px-4
    text-xl 
    text-typography
    leading-normal
  `}
`

Paper.article = Paper.withComponent('article')
Paper.section = Paper.withComponent('section')
Paper.figure = Paper.withComponent('figure')

export default Paper
