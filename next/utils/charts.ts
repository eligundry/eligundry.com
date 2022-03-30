import { theme } from 'twin.macro'
import 'chartjs-adapter-date-fns'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  TimeSeriesScale,
} from 'chart.js'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  TimeSeriesScale
)

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

export const textColor = (prefersDark: boolean) =>
  prefersDark ? theme`colors.white` : theme`colors.typography`

ChartJS.defaults.font.family = theme`fontFamily.sans`
