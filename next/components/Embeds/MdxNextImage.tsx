import React from 'react'
import Image, { ImageProps } from 'next/image'
import tw, { styled, css } from 'twin.macro'

export interface MDXNextImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
}

const MDXNextImage: React.FC<MDXNextImageProps> = (props) => {
  if (
    typeof props.src === 'string' &&
    props.src.startsWith('http') &&
    (!props.width || !props.height)
  ) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={props.src} alt={props.alt} className={props.className} />
  }

  return (
    <Wrapper className="next-mdx-image" {...props}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image placeholder="blur" {...props} />
    </Wrapper>
  )
}

const Wrapper = styled.div<MDXNextImageProps>`
  ${tw`mx-auto`}

  max-width: 690px;

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
`

export default MDXNextImage
