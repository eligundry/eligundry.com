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
      ...pick(fullConfig.theme, [
        'colors',
        'screens',
        'fontFamily',
        'animation',
      ]),
      ...pick(fullConfig, ['daisyui']),
    },
    undefined,
    2
  )
)
console.log(`Wrote tailwind theme to ${p}`)
