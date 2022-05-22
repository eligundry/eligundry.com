import { defineConfig } from 'astro-imagetools/config'

console.log('hello from astro-imagetools.config.mjs')

export default defineConfig({
  placeholder: 'dominantColor',
  format: 'webp',
  loading: 'lazy',
  formatOptions: {
    jpg: {
      quality: 90,
    },
    jpeg: {
      quality: 90,
    },
    webp: {
      quality: 90,
    },
  },
})
