import tw, { styled } from 'twin.macro'

interface PaperProps {
  transparent?: boolean
  noPadding?: boolean
}

const Paper = styled.div<PaperProps>`
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

  ${(props) => props.noPadding && tw`p-0`}

  @media (prefers-reduced-transparency: reduce) {
    ${tw`bg-siteBackground dark:bg-black`}
  }
`

Paper.article = Paper.withComponent('article')
Paper.section = Paper.withComponent('section')
Paper.figure = Paper.withComponent('figure')

export default Paper
