import theme from './theme.json'

export type Theme = typeof theme

export default function useTailwindTheme() {
  return theme
}
