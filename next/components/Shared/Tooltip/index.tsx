import React from 'react'
import ReactTooltip, { TooltipProps } from 'react-tooltip'
import clsx from 'clsx'

import { usePrefersDarkMode } from '@/components/Layout/ThemeModeProvider'
import useTailwindTheme from '@/hooks/useTailwindTheme'
import styles from './index.module.scss'

const Tooltip: React.FC<
  Omit<
    TooltipProps,
    | 'place'
    | 'effect'
    | 'border'
    | 'borderColor'
    | 'backgroundColor'
    | 'textColor'
    | 'html'
  >
> = ({ className, ...props }) => {
  const theme = useTailwindTheme()
  const prefersDark = usePrefersDarkMode()

  return (
    <ReactTooltip
      place="top"
      effect="solid"
      border
      borderColor={
        prefersDark ? theme.colors.typographyLite : 'rgb(226, 232, 240)'
      }
      backgroundColor={
        prefersDark ? theme.colors.typographyDark : theme.colors.white
      }
      textColor={prefersDark ? theme.colors.white : theme.colors.typography}
      html
      className={clsx(styles.tooltip, className)}
      {...props}
    />
  )
}

export default Tooltip
