import fs from 'fs'
import path from 'path'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import pick from 'lodash/pick.js'
import tailwindConfig from '../tailwind.config.cjs'

const p = path.join('./', 'src', 'theme.json')
const fullConfig = resolveConfig(tailwindConfig)
fs.writeFileSync(
  p,
  JSON.stringify(
    {
      colors: Object.entries(fullConfig.theme.colors).reduce(
        (acc, [name, value]) => {
          if (typeof value === 'function') {
            console.log(value.toString())
            acc[name] = value({ opacityValue: undefined })
          } else {
            acc[name] = value
          }

          return acc
        },
        {}
      ),
      ...pick(fullConfig.theme, ['screens', 'fontFamily', 'animation']),
      ...pick(fullConfig, ['daisyui']),
    },
    undefined,
    2
  )
)
console.log(`Wrote tailwind theme to ${p}`)
