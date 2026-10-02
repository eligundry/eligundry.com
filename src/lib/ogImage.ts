import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import satori from 'satori'
import sharp from 'sharp'
import * as dateFns from 'date-fns'

/**
 * Generates the OpenGraph images for blog posts and talks: the title set in the
 * site's title font (Arvo) on a white "paper" column, flanked by the same kind
 * of shapes the FancyBackground paint worklet scatters down the page gutters.
 */

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

const GUTTER_WIDTH = 210

// Light theme colors from src/styles/tailwind.css
const colors = {
  base100: '#ffffff',
  baseContent: '#161616',
  muted: '#525252',
  primary: '#088cde',
  accent: '#98a0f2',
  // The FancyBackground palette (accent, success, warning, error)
  shapes: ['#98a0f2', '#10b981', '#ffd53d', '#f94e5f'],
}

export interface OgImageOptions {
  title: string
  description?: string
  kicker: string
  date?: Date
  /** Seeds the background shapes, so each page keeps the same image. */
  seed: string
}

export async function renderOgImage(options: OgImageOptions) {
  const foreground = await satori(card(options), {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: await loadFonts(),
    loadAdditionalAsset: async (code, segment) =>
      code === 'emoji' ? loadEmoji(segment) : segment,
  })

  return sharp(Buffer.from(background(options.seed)))
    .composite([{ input: Buffer.from(foreground) }])
    .png()
    .toBuffer()
}

// Satori takes React-shaped element objects, so build them by hand rather than
// going through Preact's JSX runtime.
type Style = Record<string, string | number>
type Child = SatoriElement | string | false | undefined
interface SatoriElement {
  type: string
  key: null
  props: { style?: Style; children?: Child | Child[] }
}

const h = (
  type: string,
  style: Style,
  ...children: Child[]
): SatoriElement => ({
  type,
  key: null,
  props: {
    style: { display: 'flex', ...style },
    children: children.length === 1 ? children[0] : children,
  },
})

function titleFontSize(title: string) {
  if (title.length <= 24) {
    return 80
  } else if (title.length <= 44) {
    return 68
  }

  return 58
}

function card({ title, description, kicker, date }: OgImageOptions) {
  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    h(
      'div',
      {
        width: OG_IMAGE_WIDTH - GUTTER_WIDTH * 2,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 52px 48px',
        backgroundColor: colors.base100,
        color: colors.baseContent,
      },
      h(
        'div',
        {
          fontFamily: 'Lato',
          fontWeight: 900,
          fontSize: 26,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: colors.primary,
        },
        kicker
      ),
      h(
        'div',
        { flexDirection: 'column' },
        h(
          'div',
          {
            fontFamily: 'Arvo',
            fontWeight: 700,
            fontSize: titleFontSize(title),
            lineHeight: 1.15,
            paddingBottom: 20,
            borderBottom: `6px solid ${colors.accent}`,
          },
          title
        ),
        !!description &&
          h(
            'div',
            {
              fontFamily: 'Lato',
              fontSize: 30,
              lineHeight: 1.35,
              marginTop: 24,
              color: colors.muted,
              lineClamp: 2,
            },
            description
          )
      ),
      h(
        'div',
        {
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontFamily: 'Lato',
          fontSize: 26,
          color: colors.muted,
        },
        h(
          'div',
          { fontFamily: 'Arvo', fontWeight: 700, color: colors.baseContent },
          'Eli Gundry'
        ),
        h(
          'div',
          {},
          [date && dateFns.format(date, 'MMM d, yyyy'), 'eligundry.com']
            .filter(Boolean)
            .join(' · ')
        )
      )
    )
  )
}

/**
 * A small seeded PRNG (mulberry32), so a page's shapes are stable across builds.
 */
function createRandom(seed: string) {
  let state = 0
  for (const char of seed) {
    state = Math.imul(state ^ char.charCodeAt(0), 2654435761)
  }

  const next = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    between: (min: number, max: number) => min + next() * (max - min),
    pick: <T>(items: T[]) => items[Math.floor(next() * items.length)],
  }
}

type Point = { x: number; y: number }

/**
 * Spreads points evenly over a region the way the worklet does: random points
 * relaxed towards the centroids of their Voronoi cells (Lloyd's algorithm),
 * with the cells approximated by sampling a grid.
 */
function relaxedPoints(
  random: ReturnType<typeof createRandom>,
  count: number,
  width: number,
  height: number
) {
  let points: Point[] = [...Array(count)].map(() => ({
    x: random.between(0, width),
    y: random.between(0, height),
  }))
  const step = 6

  for (let iteration = 0; iteration < 6; iteration++) {
    const sums = points.map(() => ({ x: 0, y: 0, n: 0 }))

    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        let nearest = 0
        let nearestDistance = Infinity
        points.forEach((point, i) => {
          const distance = (point.x - x) ** 2 + (point.y - y) ** 2
          if (distance < nearestDistance) {
            nearest = i
            nearestDistance = distance
          }
        })
        sums[nearest].x += x
        sums[nearest].y += y
        sums[nearest].n += 1
      }
    }

    points = points.map((point, i) =>
      sums[i].n ? { x: sums[i].x / sums[i].n, y: sums[i].y / sums[i].n } : point
    )
  }

  return points
}

/**
 * The SVG port of FancyBackground/worklet.js's shapes: each relaxed point gets
 * a circle (sometimes a ring), a half circle, a line or a square, rotated at
 * random and colored from the site palette.
 */
function background(seed: string) {
  const random = createRandom(seed)
  const shapeTypes = (['circle', 'arc', 'line', 'rectangle'] as const).flatMap(
    (shape) => Array(Math.round(random.between(0, 8))).fill(shape)
  )
  const bias: (typeof shapeTypes)[number][] = shapeTypes.length
    ? shapeTypes
    : ['circle']
  const shapes: string[] = []

  for (const offsetX of [0, OG_IMAGE_WIDTH - GUTTER_WIDTH]) {
    const points = relaxedPoints(random, 15, GUTTER_WIDTH, OG_IMAGE_HEIGHT)

    points.forEach((point, i) => {
      // After relaxation the cell's edge sits about halfway to the nearest
      // neighbor, which stands in for the worklet's inner circle radius.
      const nearest = Math.min(
        ...points
          .filter((_, j) => j !== i)
          .map((other) => Math.hypot(other.x - point.x, other.y - point.y)),
        point.x * 2,
        (GUTTER_WIDTH - point.x) * 2
      )
      const innerRadius = (nearest / 2) * 0.75
      const radius = random.between(innerRadius / 1.5, innerRadius)
      const color = random.pick(colors.shapes)
      const x = offsetX + point.x
      const { y } = point
      const rotation = random.between(0, 360)
      const ring = random.between(0, 1) > 0.5
      let shape = ''

      switch (random.pick(bias)) {
        case 'circle':
          shape = `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" />`
          if (ring) {
            shape += `<circle cx="${x}" cy="${y}" r="${radius / 2}" fill="${colors.base100}" />`
          }
          break
        case 'arc':
          shape = halfCircle(x, y, radius, color)
          if (ring) {
            shape += halfCircle(x, y - 1, radius / 2, colors.base100)
          }
          break
        case 'line': {
          const length = radius * 0.5
          shape = `<line x1="${x - length / 2}" y1="${y - length / 2}" x2="${x + length}" y2="${y + length}" stroke="${color}" stroke-width="${Math.min(innerRadius, 40)}" stroke-linecap="round" />`
          break
        }
        case 'rectangle':
          shape = `<rect x="${x - radius / 2}" y="${y - radius / 2}" width="${radius}" height="${radius}" fill="${color}" />`
          break
      }

      shapes.push(`<g transform="rotate(${rotation} ${x} ${y})">${shape}</g>`)
    })
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" viewBox="0 0 ${OG_IMAGE_WIDTH} ${OG_IMAGE_HEIGHT}"><rect width="100%" height="100%" fill="${colors.base100}" />${shapes.join('')}</svg>`
}

// The worklet's `arc(x, y, r, 0, PI)`: the lower half of a circle
const halfCircle = (x: number, y: number, r: number, fill: string) =>
  `<path d="M ${x + r} ${y} A ${r} ${r} 0 0 1 ${x - r} ${y} Z" fill="${fill}" />`

const require = createRequire(import.meta.url)
let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined

function loadFonts() {
  const font = (
    pkg: string,
    file: string,
    name: string,
    weight: 400 | 700 | 900
  ) =>
    fs
      .readFile(require.resolve(`@fontsource/${pkg}/files/${file}`))
      .then((data) => ({ name, data, weight, style: 'normal' as const }))

  fonts ??= Promise.all([
    font('arvo', 'arvo-latin-700-normal.woff', 'Arvo', 700),
    font('lato', 'lato-latin-400-normal.woff', 'Lato', 400),
    font('lato', 'lato-latin-900-normal.woff', 'Lato', 900),
  ])

  return fonts
}

const emojiCache = new Map<string, Promise<string>>()

/**
 * Satori can't draw color emoji from a font, so titles like "👨‍🍳 Veggie Burgers"
 * get Twemoji's SVGs instead. If the CDN can't be reached the emoji is left
 * out rather than failing the build.
 */
function loadEmoji(segment: string) {
  const codepoints = [...segment]
    .map((char) => char.codePointAt(0)!.toString(16))
    // Twemoji drops the variation selector unless the emoji is a ZWJ sequence
    .filter((code) => segment.includes('‍') || code !== 'fe0f')
    .join('-')

  if (!emojiCache.has(codepoints)) {
    emojiCache.set(
      codepoints,
      fetch(
        `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${codepoints}.svg`
      )
        .then((res) => (res.ok ? res.text() : Promise.reject(res.statusText)))
        .then(
          (svg) =>
            `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
        )
        .catch(() => '')
    )
  }

  return emojiCache.get(codepoints)!
}
