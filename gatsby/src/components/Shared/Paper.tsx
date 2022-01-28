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
    mb-4
    print:mb-0
  `}

  body[data-fancy-background="true"] & {
    ${({ transparent = false }) => {
      return !transparent
        ? tw`shadow print:shadow-none`
        : tw`bg-transparent dark:bg-transparent shadow-none`
    }}
  }

  ${({ noPadding = false }) => noPadding && tw`p-0`}

  @media (prefers-reduced-transparency: reduce) {
    ${tw`bg-siteBackground dark:bg-black`}
  }
`

// @ts-ignore
Paper.article = Paper.withComponent('article')
// @ts-ignore
Paper.section = Paper.withComponent('section')
// @ts-ignore
Paper.figure = Paper.withComponent('figure')

export default Paper
