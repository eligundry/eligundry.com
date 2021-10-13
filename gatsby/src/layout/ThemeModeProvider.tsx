import React, { useEffect, useContext, useCallback, useMemo } from 'react'
import Helmet from 'react-helmet'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import useMedia from 'react-use/lib/useMedia'

type Theme = 'light' | 'dark'
interface IThemeModeContext {
  theme: Theme
  toggleTheme: () => void
}

const ThemeModeContext = React.createContext<IThemeModeContext>({
  theme: 'light',
  toggleTheme: () => {},
})

const ThemeModeProvider: React.FC = ({ children }) => {
  const prefersDark = useMedia('(prefers-color-scheme: dark)')
  const [theme, setTheme] = useLocalStorage<Theme>(
    'theme',
    prefersDark ? 'dark' : 'light'
  )

  const toggleTheme = useCallback(
    () => setTheme(t => (t === 'light' ? 'dark' : 'light')),
    []
  )

  // Change the theme if the system changes what it prefers
  useEffect(() => setTheme(prefersDark ? 'dark' : 'light'), [prefersDark])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <Helmet bodyAttributes={{ class: theme }} />
      {children}
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode(): IThemeModeContext {
  return useContext(ThemeModeContext)
}

export function usePrefersDarkMode(): boolean {
  return useThemeMode().theme === 'dark'
}

export default ThemeModeProvider
