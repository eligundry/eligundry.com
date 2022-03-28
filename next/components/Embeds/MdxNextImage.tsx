import React from 'react'
import Image, { ImageProps } from 'next/image'

const MdxNextImage: React.FC<ImageProps> = (props) => {
  if (
    typeof props.src === 'string' &&
    props.src.startsWith('http') &&
    (!props.width || !props.height)
  ) {
    return <img src={props.src} alt={props.alt} className={props.className} />
  }

  return <Image {...props} />
}

export default MdxNextImage
