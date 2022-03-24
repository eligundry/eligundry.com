import React from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import useDarkMode from 'use-dark-mode'

const ThemeModeProvider: React.FC = ({ children }) => {
  const darkMode = useDarkMode(undefined, {
    classNameDark: 'dark',
    classNameLight: 'light',
  })

  return (
    <SkeletonTheme
      baseColor={darkMode.value ? '#000' : undefined}
      highlightColor={darkMode.value ? '#3e3e3e' : undefined}
    >
      {children}
    </SkeletonTheme>
  )
}

export function usePrefersDarkMode(): boolean {
  return useDarkMode().value
}

export default ThemeModeProvider
