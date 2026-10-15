import materialLighter from '@shikijs/themes/material-theme-lighter'
import materialDarker from '@shikijs/themes/material-theme-darker'

type Theme = typeof materialLighter

/**
 * Syntax highlighting themes for code blocks, one per site theme.
 *
 * They're Material Lighter and Material Darker with every colour nudged
 * towards black (light) or white (dark) until it reads at 4.5:1 (WCAG AA)
 * against each background a code block can sit on in that theme, so they keep
 * Material's hues. Used with Shiki's `themes` option; the dark colours are
 * switched in by `[data-theme='dark']` CSS in src/styles/tailwind.css.
 */

const MIN_CONTRAST = 4.5

// Backgrounds a code block can have: the page, the prose <pre> background and
// the theme's own background (which Notion-rendered code keeps).
const LIGHT_BACKGROUNDS = ['#ffffff', '#f4f4f5', '#fafafa']
const DARK_BACKGROUNDS = ['#1c1917', '#292524', '#212121']

const toRgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

const toHex = (rgb: number[]) =>
  '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

const luminance = (hex: string) => {
  const [r, g, b] = toRgb(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function ensureContrast(color: string, backgrounds: string[], towards: string) {
  // Drop any alpha (e.g. Material's faded punctuation), it would only lower
  // the contrast further.
  const base = toRgb(color.slice(0, 7).toLowerCase())
  const target = toRgb(towards)
  for (let t = 0; t <= 1; t += 0.02) {
    const candidate = toHex(base.map((v, i) => v + (target[i] - v) * t))
    if (backgrounds.every((bg) => contrast(candidate, bg) >= MIN_CONTRAST)) {
      return candidate
    }
  }
  return towards
}

function accessible(
  theme: Theme,
  name: string,
  backgrounds: string[],
  towards: string
): Theme {
  const fix = (color: string) => ensureContrast(color, backgrounds, towards)
  const foreground = theme.colors?.['editor.foreground']
  return {
    ...theme,
    name,
    colors: {
      ...theme.colors,
      ...(foreground ? { 'editor.foreground': fix(foreground) } : {}),
    },
    tokenColors: theme.tokenColors?.map((token) =>
      token.settings?.foreground
        ? {
            ...token,
            settings: {
              ...token.settings,
              foreground: fix(token.settings.foreground),
            },
          }
        : token
    ),
  }
}

export const codeThemes = {
  light: accessible(
    materialLighter,
    'material-theme-lighter-aa',
    LIGHT_BACKGROUNDS,
    '#000000'
  ),
  dark: accessible(
    materialDarker,
    'material-theme-darker-aa',
    DARK_BACKGROUNDS,
    '#ffffff'
  ),
}
