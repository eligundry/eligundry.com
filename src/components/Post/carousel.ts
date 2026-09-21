/**
 * Progressive enhancement for `Carousel.astro`.
 *
 * Everything the carousel does is reachable without JavaScript: the slides are
 * a scroll-snap container and every control is an anchor to a slide id. This
 * module only layers on what anchors cannot do — scrolling the track without
 * yanking the page around, reflecting the active slide in the
 * indicators/caption/counter, keyboard stepping and autoplay.
 */
export const CAROUSEL_SELECTOR = '[data-carousel]'

/** Anything faster than this is hostile, so treat it as "off". */
const AUTOPLAY_MIN = 1000

type Align = 'start' | 'center' | 'end'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initCarousel(root: HTMLElement) {
  if (root.dataset.carouselReady === 'true') {
    return
  }

  const track = root.querySelector<HTMLElement>('[data-carousel-track]')

  if (!track) {
    return
  }

  const slides = Array.from(
    track.querySelectorAll<HTMLElement>(':scope > .carousel-slide')
  )

  if (!slides.length) {
    return
  }

  root.dataset.carouselReady = 'true'

  const vertical = root.dataset.vertical === 'true'
  const loop = root.dataset.loop === 'true'
  const align = (root.dataset.align ?? 'center') as Align
  // Only the picker's controls carry the active state; the overlay arrows use
  // the same `data-carousel-goto` hook but are not a position indicator.
  const indicators = Array.from(
    root.querySelectorAll<HTMLElement>(
      '[data-carousel-indicators] [data-carousel-goto]'
    )
  )
  const captions = Array.from(
    root.querySelectorAll<HTMLElement>('[data-carousel-caption]')
  )
  const counter = root.querySelector<HTMLElement>('[data-carousel-current]')
  const stepper = root.querySelector<HTMLElement>('[data-carousel-stepper]')
  let active = -1

  /**
   * Distance from the track's snap line to an element's, in the scroll axis.
   * Matching daisyUI's `carousel-{start,center,end}` keeps the measurement in
   * step with where the browser will snap.
   */
  const offsetFromSnapLine = (element: HTMLElement) => {
    const box = element.getBoundingClientRect()
    const trackBox = track.getBoundingClientRect()
    const [start, size, trackStart, trackSize] = vertical
      ? [box.top, box.height, trackBox.top, trackBox.height]
      : [box.left, box.width, trackBox.left, trackBox.width]

    switch (align) {
      case 'center':
        return start + size / 2 - (trackStart + trackSize / 2)
      case 'end':
        return start + size - (trackStart + trackSize)
      default:
        return start - trackStart
    }
  }

  const goTo = (index: number) => {
    const target = slides[index]

    if (!target) {
      return
    }

    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const delta = offsetFromSnapLine(target)

    // `scrollIntoView` walks every scrollable ancestor, which on a hash link
    // drags the whole page to the carousel. Scrolling the track itself leaves
    // the reader where they were.
    track.scrollTo(
      vertical
        ? { top: track.scrollTop + delta, behavior }
        : { left: track.scrollLeft + delta, behavior }
    )
  }

  const step = (delta: number) => {
    const next = active + delta

    if (next >= 0 && next < slides.length) {
      goTo(next)
      return
    }

    if (loop) {
      goTo((next + slides.length) % slides.length)
    }
  }

  const setActive = (index: number) => {
    if (index === active) {
      return
    }

    active = index

    indicators.forEach((indicator) => {
      if (Number(indicator.dataset.carouselGoto) === index) {
        indicator.setAttribute('aria-current', 'true')
      } else {
        indicator.removeAttribute('aria-current')
      }
    })

    captions.forEach((caption) => {
      caption.hidden = Number(caption.dataset.carouselCaption) !== index
    })

    if (counter) {
      counter.textContent = `${index + 1}`
    }
  }

  /** Whichever slide sits closest to the snap line is the one on screen. */
  const syncActive = () => {
    let closest = 0
    let shortest = Infinity

    slides.forEach((slide, index) => {
      const distance = Math.abs(offsetFromSnapLine(slide))

      if (distance < shortest) {
        shortest = distance
        closest = index
      }
    })

    setActive(closest)
  }

  let scheduled = false
  track.addEventListener(
    'scroll',
    () => {
      if (scheduled) {
        return
      }

      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        syncActive()
      })
    },
    { passive: true }
  )

  // The indicators and overlay arrows are anchors, so they still work if this
  // never runs; intercepting them just avoids the page-level scroll jump.
  root.addEventListener('click', (event) => {
    const control = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      '[data-carousel-goto]'
    )

    if (!control) {
      return
    }

    const index = Number(control.dataset.carouselGoto)

    if (Number.isNaN(index)) {
      return
    }

    event.preventDefault()
    goTo(index)
  })

  // Multi-up carousels cannot express "one page over" as a static anchor, so
  // their arrows only exist once we are here to drive them.
  if (stepper) {
    stepper.hidden = false
    stepper
      .querySelectorAll<HTMLElement>('[data-carousel-step]')
      .forEach((button) => {
        button.addEventListener('click', () =>
          step(Number(button.dataset.carouselStep) || 1)
        )
      })
  }

  if (root.dataset.keyboard === 'true') {
    const forwardKey = vertical ? 'ArrowDown' : 'ArrowRight'
    const backKey = vertical ? 'ArrowUp' : 'ArrowLeft'

    track.addEventListener('keydown', (event) => {
      if (event.key === forwardKey) {
        step(1)
      } else if (event.key === backKey) {
        step(-1)
      } else if (event.key === 'Home') {
        goTo(0)
      } else if (event.key === 'End') {
        goTo(slides.length - 1)
      } else {
        return
      }

      event.preventDefault()
    })
  }

  const autoplay = Number(root.dataset.autoplay)

  if (autoplay >= AUTOPLAY_MIN && !prefersReducedMotion()) {
    let timer: number | undefined

    const pause = () => {
      if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
    }

    const play = () => {
      if (timer !== undefined || document.hidden) {
        return
      }

      timer = window.setInterval(() => {
        if (!loop && active === slides.length - 1) {
          pause()
          return
        }

        step(1)
      }, autoplay)
    }

    root.addEventListener('pointerenter', pause)
    root.addEventListener('pointerleave', play)
    root.addEventListener('focusin', pause)
    root.addEventListener('focusout', play)
    document.addEventListener('visibilitychange', () =>
      document.hidden ? pause() : play()
    )

    play()
  }

  syncActive()
}
