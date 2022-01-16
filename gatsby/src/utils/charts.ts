import { Chart } from 'chart.js'
import { theme } from 'twin.macro'

export const toolTipTheme = (prefersDark: boolean) => ({
  displayColors: false,
  titleFont: {
    size: 14,
  },
  bodyFont: {
    size: 16,
  },
  backgroundColor: prefersDark
    ? theme`colors.typographyDark`
    : theme`colors.white`,
  footerColor: prefersDark ? theme`colors.typographyDark` : theme`colors.white`,
  bodyColor: prefersDark ? theme`colors.white` : theme`colors.black`,
  titleColor: prefersDark ? theme`colors.white` : theme`colors.black`,
  borderWidth: 1,
  borderColor: prefersDark
    ? theme`colors.typographyLite`
    : 'rgb(226, 232, 240)',
})

Chart.defaults.font.family = theme`fontFamily.sans`
