import 'chartjs-adapter-date-fns'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  TimeSeriesScale,
  Tooltip,
  type TooltipOptions,
} from 'chart.js'
import theme from '../theme.json'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  TimeSeriesScale,
  Tooltip
)

export const cssvar = (
  name: string,
  element: Element | HTMLElement = document.documentElement
) => getComputedStyle(element).getPropertyValue(name).trim()

export const tooltipTheme = (): Partial<TooltipOptions> => ({
  displayColors: false,
  titleFont: {
    family: "'Lato', sans-serif",
    size: 14,
  },
  bodyFont: {
    family: "'Lato', sans-serif",
    size: 14,
  },
  // daisyUI v5 `tooltip-primary` renders on the primary color; read the theme
  // colors directly (the v4 `--tooltip-color`/`--tooltip-text-color` vars are gone).
  backgroundColor: cssvar('--color-primary'),
  footerColor: cssvar('--color-primary'),
  bodyColor: cssvar('--color-primary-content'),
  titleColor: cssvar('--color-primary-content'),
})

ChartJS.defaults.font.family = theme.fontFamily.sans.join(', ')
