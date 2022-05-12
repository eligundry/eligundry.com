import { defineConfig } from 'astro-imagetools/config'

export default defineConfig({
  placeholder: 'dominantColor',
  format: ['webp', 'jpg'],
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
