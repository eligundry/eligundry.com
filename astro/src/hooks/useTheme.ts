import { useState, useEffect } from 'react'
import useMedia from 'react-use/lib/useMedia'
import theme from '../theme.json'

type Pallete = NonNullable<typeof theme.daisyui.themes[0]['dark']>
type Theme = typeof theme
type Query = string | ((theme: Theme) => string)

export function useMediaQuery(query: Query, defaultState = false) {
  if (typeof query !== 'string') {
    query = query(theme)
  }

  return useMedia(query, defaultState)
}

export function useDarkMode() {
  const mediaQueryDarkMode = useMediaQuery(
    'only screen and (prefers-color-scheme: dark)',
    false
  )
  const [htmlDataTheme, setHtmlDataTheme] = useState<
    'light' | 'dark' | undefined
  >()

  useEffect(() => {
    const htmlTheme = document.querySelector('html')?.dataset?.theme

    if (htmlTheme) {
      setHtmlDataTheme(htmlTheme === 'light' ? 'light' : 'dark')
    }
  }, [])

  useEffect(() => {
    const obs = new MutationObserver((mutationList) => {
      mutationList.forEach((m) => {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          setHtmlDataTheme(
            m.target.dataset?.theme === 'light' ? 'light' : 'dark'
          )
        }
      })
    })
    obs.observe(document.querySelector('html'), {
      attributes: true,
    })

    return () => obs.disconnect()
  }, [])

  if (htmlDataTheme) {
    return htmlDataTheme === 'dark'
  }

  return mediaQueryDarkMode
}

export default function useTheme() {
  const darkMode = useDarkMode()
  const palletes = theme.daisyui.themes.reduce((acc, t) => {
    if (t.dark) {
      acc.dark = t.dark
    } else if (t.light) {
      acc.light = t.light
    }

    return acc
  }, {} as Record<'light' | 'dark', Pallete>)

  return {
    darkMode,
    lightMode: !darkMode,
    pallete: darkMode ? palletes.dark : palletes.light,
    theme,
  }
}
