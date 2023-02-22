import React from 'react'
import Image, { ImageProps } from 'next/image'
import clsx from 'clsx'

export interface MDXNextImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  containerClassName?: string
}

const MDXNextImage: React.FC<MDXNextImageProps> = ({
  blurDataURL,
  containerClassName,
  ...props
}) => {
  if (
    typeof props.src === 'string' &&
    props.src.startsWith('http') &&
    (!props.width || !props.height)
  ) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={props.src} alt={props.alt} className={props.className} />
  }

  return (
    <div
      className={clsx(
        'mx-auto',
        'maw-w-full',
        'next-mdx-image',
        containerClassName
      )}
      style={{
        width: props.width ? `${props.width}px` : undefined,
        maxWidth: '100%',
      }}
      {...props}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image placeholder="blur" blurDataURL={blurDataURL} {...props} />
    </div>
  )
}

export default MDXNextImage
