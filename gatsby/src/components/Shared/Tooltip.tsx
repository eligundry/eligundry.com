import React from 'react'
import ReactTooltip from 'react-tooltip'
import { styled, theme } from 'twin.macro'

const Tooltip = styled(({ className, ...props }) => (
  <ReactTooltip
    place="top"
    effect="solid"
    border
    borderColor="rgb(226, 232, 240)"
    backgroundColor="white"
    textColor="black"
    html
    className={className}
    {...props}
  />
))`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  font-family: ${theme`fontFamily.sans`};

  &.show {
    opacity: 1;
  }

  & strong {
    font-family: ${theme`fontFamily.sans`};
    font-weight: 600;
  }
`

export default Tooltip
