import tw, { styled, theme } from 'twin.macro'

const Paper = styled.div<{ transparent?: boolean }>`
  ${tw`
    w-full 
    p-4
    px-4
    text-xl 
    text-typography
    dark:text-white
    leading-normal
    rounded-lg
    bg-paper
    dark:bg-paperDark
  `}

  ${(props) => props.transparent && tw`bg-transparent dark:bg-transparent`}

  @media (prefers-reduced-transparency: reduce) {
    ${tw`bg-siteBackground dark:bg-black`}
  }
`

Paper.article = Paper.withComponent('article')
Paper.section = Paper.withComponent('section')
Paper.figure = Paper.withComponent('figure')

export default Paper
