import React from 'react'
import ReactTooltip from 'react-tooltip'
import { styled, theme } from 'twin.macro'

const Tooltip = styled(({ className }) => {
  return (
    <ReactTooltip
      place="top"
      effect="solid"
      border
      borderColor="rgb(226, 232, 240)"
      backgroundColor="white"
      textColor="black"
      html={true}
      className={className}
    />
  )
})`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;

  &.show {
    opacity: 1;
  }

  & strong {
    font-family: ${theme`fontFamily.sans`};
    font-weight: 600;
  }
`

export default Tooltip
