import React from 'react'
import tw, { styled } from 'twin.macro'

interface Props
  extends Omit<React.HTMLProps<HTMLIFrameElement>, 'width' | 'height'> {
  width: number
  height: number
}

const ResponsiveIFrame: React.FC<Props> = ({ width, height, ...props }) => (
  <Wrapper
    style={{ paddingBottom: `${(height / width) * 100}%` }}
    className="responsive-iframe"
  >
    {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
    <iframe {...props} />
  </Wrapper>
)

const Wrapper = styled.div`
  position: relative;
  height: 0;
  overflow: hidden;

  & > iframe {
    top: 0;
    left: 0;
    ${tw`absolute w-full h-full`}
  }
`

export default ResponsiveIFrame
