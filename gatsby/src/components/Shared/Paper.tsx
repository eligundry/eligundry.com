import tw, { styled } from 'twin.macro'

const Paper = styled.div<{ transparent?: boolean }>`
  ${tw`
    w-full 
    p-4
    px-4
    text-xl 
    text-typography
    dark:text-white
    leading-normal
    bg-paper
    dark:bg-paperDark
    rounded-lg
  `}

  ${(props) => props.transparent && tw`bg-transparent dark:bg-transparent`}
`

Paper.article = Paper.withComponent('article')
Paper.section = Paper.withComponent('section')
Paper.figure = Paper.withComponent('figure')

export default Paper
