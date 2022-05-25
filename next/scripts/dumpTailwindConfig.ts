import fs from 'fs'
import path from 'path'
import resolveConfig from 'tailwindcss/resolveConfig'
import pick from 'lodash/pick'
import tailwindConfig from '../tailwind.config'

const p = path.join('./', 'hooks', 'useTailwindTheme', 'theme.json')
const fullConfig = resolveConfig(tailwindConfig)
fs.writeFileSync(
  p,
  JSON.stringify(
    pick(fullConfig.theme, ['colors', 'screens', 'fontFamily', 'animation']),
    undefined,
    2
  )
)
console.log(`Wrote tailwind theme to ${p}`)
