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
  TooltipOptions,
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

const tooltipCssvar = (name: string) => {
  let elm = document.querySelector('.tooltip')

  if (!elm) {
    elm = document.createElement('div')
    elm.classList.add('tooltip')
    document.body.append(elm)
    const v = cssvar(name, elm)
    elm.remove()

    return v
  }

  return cssvar(name, elm)
}

export const tooltipTheme = (): Partial<TooltipOptions> => ({
  displayColors: false,
  titleFont: {
    size: 14,
  },
  bodyFont: {
    size: 16,
  },
  backgroundColor: tooltipCssvar('--tooltip-color'),
  footerColor: tooltipCssvar('--tooltip-color'),
  bodyColor: tooltipCssvar('--tooltip-text-color'),
  titleColor: tooltipCssvar('--tooltip-text-color'),
})

ChartJS.defaults.font.family = theme.fontFamily.sans.join(', ')
