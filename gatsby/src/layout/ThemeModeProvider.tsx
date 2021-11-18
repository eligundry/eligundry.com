import React, {
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useState,
} from 'react'
import Helmet from 'react-helmet'
import { SkeletonTheme } from 'react-loading-skeleton'
import useMedia from 'react-use/lib/useMedia'
import { theme as siteTheme } from 'twin.macro'

type Theme = 'light' | 'dark'
interface IThemeModeContext {
  theme: Theme
  toggleTheme: () => void
}

const ThemeModeContext = React.createContext<IThemeModeContext>({
  theme: 'light',
  toggleTheme: () => {},
})

ThemeModeContext.displayName = 'ThemeModeContext'

const ThemeModeProvider: React.FC = ({ children }) => {
  const prefersDark = useMedia('(prefers-color-scheme: dark)')
  const [theme, setTheme] = useState<Theme>(prefersDark ? 'dark' : 'light')

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    [setTheme]
  )

  // Change the theme if the system changes what it prefers
  useEffect(() => setTheme(prefersDark ? 'dark' : 'light'), [prefersDark])

  const value = useMemo<IThemeModeContext>(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <SkeletonTheme
        baseColor={theme === 'dark' ? '#000' : undefined}
        highlightColor={theme === 'dark' ? '#3e3e3e' : undefined}
      >
        <Helmet bodyAttributes={{ class: theme }} />
        {children}
      </SkeletonTheme>
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
