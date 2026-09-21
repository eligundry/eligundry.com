# The `<Carousel />` post component

`src/components/Post/Carousel.astro` wraps [daisyUI's carousel][daisyui] for use
inside blog posts and talks. It is registered in
`src/components/Post/components.astro`, so MDX can use `<Carousel />` without
importing it — only the images need importing.

```mdx
import crust from '../../assets/img/strawberry-pie/making-the-crust.jpg'
import pie from '../../assets/img/strawberry-pie/finished-pie.jpeg'

<Carousel
  label="Making the strawberry pretzel pie"
  images={[
    {
      src: crust,
      alt: 'Pressing the crust into the pan',
      caption: 'The crust',
    },
    { src: pie, alt: 'The finished pie', caption: 'Worth it' },
  ]}
/>
```

Each entry in `images` can be a full slide object, a bare imported image, or a
bare path/URL string — `<Carousel images={[crust, pie]} />` works, it just has no
alt text or captions. Images go through `astro:assets`, so they are converted
and resized at build time like everywhere else on the site.

## How it degrades

The carousel is a scroll-snap container and every control is an anchor to a
slide's id, so it works with JavaScript disabled. `carousel.ts` then layers on
the parts anchors cannot do: scrolling the track without dragging the page to
it, the active indicator/caption/counter, keyboard stepping and autoplay. The
one control that _requires_ JavaScript is the previous/next pair on a multi-up
carousel (`slidesPerView` ≠ 1), because "one page over" is not a fixed
destination — it stays hidden until the script wires it up.

## Props

| Prop                                      | Default                    | What it does                                                                                                                 |
| ----------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `images`                                  | —                          | The slides. Falls back to the default slot, where each direct child becomes a slide.                                         |
| `label`                                   | `'Image carousel'`         | Accessible name for the carousel and its slide picker.                                                                       |
| `align`                                   | `'center'`                 | Snap alignment: `start`, `center`, `end`.                                                                                    |
| `direction`                               | `'horizontal'`             | `vertical` scrolls up/down and needs a `height`.                                                                             |
| `slidesPerView`                           | `1`                        | Slides visible at once, or any CSS length/percentage.                                                                        |
| `gap`                                     | `0`                        | Space between slides: Tailwind spacing units, or a CSS length.                                                               |
| `arrows`                                  | `true`                     | Previous/next controls.                                                                                                      |
| `indicators`                              | `'dots'`                   | `dots`, `numbers`, `thumbnails`, or `false`.                                                                                 |
| `counter`                                 | `false`                    | "3 / 8" badge in the corner.                                                                                                 |
| `loop`                                    | `true`                     | Wrap around at both ends.                                                                                                    |
| `keyboard`                                | `true`                     | Arrow/Home/End keys once the track has focus.                                                                                |
| `autoplay`                                | `false`                    | Milliseconds between slides (`true` means 5000). Skipped under `prefers-reduced-motion`, paused on hover, focus and tab-out. |
| `captions`                                | `true`                     | Render the slides' `caption`s.                                                                                               |
| `height`                                  | —                          | Fixed track height, e.g. `24rem`.                                                                                            |
| `aspect`                                  | —                          | Fixed slide aspect ratio, e.g. `16/9`. Ignored when `height` is set.                                                         |
| `fit`                                     | `'contain'`                | `object-fit` for images in a fixed `height`/`aspect` box.                                                                    |
| `maxHeight`                               | `'70vh'`                   | Cap on the natural height of unconstrained slides.                                                                           |
| `rounded` / `bordered` / `shadow`         | `true` / `false` / `false` | Track chrome.                                                                                                                |
| `fullBleed`                               | `false`                    | Span the viewport instead of the prose column.                                                                               |
| `scrollbar`                               | `false`                    | Show the native scrollbar daisyUI hides.                                                                                     |
| `format` / `quality` / `widths` / `sizes` | `'webp'` / `90` / — / —    | Passed to `astro:assets`. `widths` generates a `srcset`.                                                                     |
| `loading`                                 | `'lazy'`                   | Default for every slide; a slide can override it.                                                                            |
| `id`                                      | generated                  | Base for the slide ids the anchors point at.                                                                                 |
| `class`                                   | —                          | Extra classes on the wrapping `<figure>`.                                                                                    |

Per-slide keys: `src`, `alt`, `caption`, `href` (links the image), `loading`,
and `width`/`height` to skip size inference.

[daisyui]: https://daisyui.com/components/carousel/
