import fs from 'fs'
import path from 'path'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config'

const p = path.join('./', 'hooks', 'useTailwindTheme', 'config.json')
const fullConfig = resolveConfig(tailwindConfig)
fs.writeFileSync(p, JSON.stringify(fullConfig.theme, undefined, 2))
console.log(`Wrote tailwind config to ${p}`)
