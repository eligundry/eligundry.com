import React from 'react'
import clsx from 'clsx'

interface Props
  extends Omit<React.HTMLProps<HTMLIFrameElement>, 'width' | 'height'> {
  width: number
  height: number
}

const ResponsiveIFrame: React.FC<Props> = ({ width, height, ...props }) => {
  let title = 'iframe embed'

  if (props.src) {
    title += ` from ${new URL(props.src).host}`
  }

  return (
    <div
      style={{ paddingBottom: `${(height / width) * 100}%` }}
      className={clsx(
        'responsive-iframe',
        'relative',
        'overflow-hidden',
        'h-0'
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe
        className={clsx(
          'absolute',
          'w-full',
          'h-full',
          'top-0',
          'left-0',
          props.className
        )}
        title={title}
        {...props}
      />
    </div>
  )
}

export default ResponsiveIFrame
