import React from 'react'
import ReactTooltip from 'react-tooltip'
import { styled, theme } from 'twin.macro'

import { usePrefersDarkMode } from '@/components/Layout/ThemeModeProvider'

const Tooltip = styled(({ className, ...props }) => {
  const prefersDark = usePrefersDarkMode()

  return (
    <ReactTooltip
      place="top"
      effect="solid"
      border
      borderColor={
        prefersDark ? theme`colors.typographyLite` : 'rgb(226, 232, 240)'
      }
      backgroundColor={
        prefersDark ? theme`colors.typographyDark` : theme`colors.white`
      }
      textColor={prefersDark ? theme`colors.white` : theme`colors.typography`}
      html
      className={className}
      {...props}
    />
  )
})`
  font-size: 0.9rem;
  font-weight: 600;
  font-family: ${theme`fontFamily.sans`};

  &.show {
    opacity: 1;
  }

  & strong {
    font-family: ${theme`fontFamily.sans`};
    font-weight: 600;
  }

  .dark &::before,
  .dark &::after {
    background-color: ${theme`colors.typographyDark`};
  }
`

export default Tooltip
