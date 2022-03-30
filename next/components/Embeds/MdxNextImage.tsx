import React from 'react'
import Image, { ImageProps } from 'next/image'
import tw, { styled, css } from 'twin.macro'

interface Props extends Omit<ImageProps, 'src'> {
  src: string
}

const MdxNextImage: React.FC<Props> = (props) => {
  if (
    typeof props.src === 'string' &&
    props.src.startsWith('http') &&
    (!props.width || !props.height)
  ) {
    return <img src={props.src} alt={props.alt} className={props.className} />
  }

  return (
    <Wrapper className="next-mdx-image" {...props}>
      <Image placeholder="blur" blurDataURL={props.src} {...props} />
    </Wrapper>
  )
}

const Wrapper = styled.div<Props>`
  ${tw`mx-auto`}

  max-width: 690px;

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
`

export default MdxNextImage
