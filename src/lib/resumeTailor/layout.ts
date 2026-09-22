// Estimates how the resume paginates when printed, so an agent can spot and
// fix ugly page breaks without opening the print dialog.
//
// The tailored page is cloned (without scripts) into an off-screen iframe
// that's as wide as a sheet of paper and padded by the page margins. That's
// how Chrome prints: media queries see the full page width while content is
// laid out inside the margins. `html[data-print-preview]` switches on every
// `print:` style. Each `data-print-unit` block is measured, then Chrome's
// fragmentation is simulated: blocks with `break-inside: avoid` move to the
// next page when they don't fit, `data-tailor-break-before` forces a new page,
// and anything else splits across the boundary. The fixed print footer is
// drawn over the bottom of every page without taking up space, so blocks that
// end under it are reported too.

export const PAGE = {
  // US Letter with the margins set by `@page` on /resume/.
  widthIn: 8.5,
  heightIn: 11,
  marginTopIn: 0.4,
  marginSideIn: 0.4,
  marginBottomIn: 0.5 / 2.54,
}

const PX_PER_IN = 96

export const printableWidthPx = () =>
  (PAGE.widthIn - PAGE.marginSideIn * 2) * PX_PER_IN
export const printableHeightPx = () =>
  (PAGE.heightIn - PAGE.marginTopIn - PAGE.marginBottomIn) * PX_PER_IN

export interface Unit {
  id: string
  top: number
  height: number
  avoidBreakInside: boolean
  breakBefore: boolean
  isHeading: boolean
}

export interface PrintLayout {
  approximate: true
  pageCount: number
  targetPages?: number
  usablePageHeightPx: number
  lastPageFillPercent: number
  pages: { page: number; ids: string[] }[]
  /** Blocks that start on one page and continue on the next. */
  splits: { id: string; page: number; continuesOnPage: number }[]
  /** Blocks pushed to the next page, leaving a gap behind them. */
  pushed: { id: string; toPage: number; gapPx: number; gapPercent: number }[]
  /** Section headings stranded at the bottom of a page. */
  orphanedHeadings: { id: string; page: number }[]
  /** Blocks whose text runs under the print footer at the bottom of a page. */
  footerOverlaps: { id: string; page: number; overlapPx: number }[]
  /** Y offsets (px, relative to the first block) where each page starts. */
  pageStarts: number[]
  hints: string[]
}

/** Pure pagination simulation over measured units. */
export function paginate(
  units: Unit[],
  usable: number,
  {
    targetPages,
    footerHeight = 0,
  }: { targetPages?: number; footerHeight?: number } = {}
): PrintLayout {
  const pages: PrintLayout['pages'] = [{ page: 1, ids: [] }]
  const splits: PrintLayout['splits'] = []
  const pushed: PrintLayout['pushed'] = []
  const footerOverlaps: PrintLayout['footerOverlaps'] = []
  const checkFooter = (id: string, bottom: number) => {
    const overlap = bottom - (pageEnd - footerHeight)
    if (footerHeight && overlap > 0.5) {
      footerOverlaps.push({
        id,
        page: pages.length,
        overlapPx: Math.round(overlap),
      })
    }
  }
  const pageStarts = [0]
  const unitPage = new Map<string, number>()
  let shift = 0
  let pageEnd = usable
  let lastBottom = 0

  const newPage = (at: number) => {
    pageStarts.push(at)
    pageEnd = at + usable
    pages.push({ page: pages.length + 1, ids: [] })
  }

  for (const unit of units) {
    let top = unit.top + shift
    const pageStart = pageEnd - usable

    if (unit.breakBefore && top > pageStart + 0.5) {
      shift += pageEnd - top
      top = pageEnd
      newPage(pageEnd)
    }
    while (top >= pageEnd) {
      newPage(pageEnd)
    }

    const bottom = top + unit.height
    if (bottom > pageEnd + 0.5) {
      if (
        unit.avoidBreakInside &&
        unit.height <= usable &&
        top > pageEnd - usable + 0.5
      ) {
        const gap = pageEnd - top
        shift += gap
        newPage(pageEnd)
        top = pageEnd - usable
        pushed.push({
          id: unit.id,
          toPage: pages.length,
          gapPx: Math.round(gap),
          gapPercent: Math.round((gap / usable) * 100),
        })
      } else {
        const startPage = pages.length
        pages[startPage - 1].ids.push(unit.id)
        unitPage.set(unit.id, startPage)
        checkFooter(unit.id, pageEnd)
        while (bottom > pageEnd + 0.5) {
          newPage(pageEnd)
        }
        splits.push({
          id: unit.id,
          page: startPage,
          continuesOnPage: pages.length,
        })
        lastBottom = bottom
        continue
      }
    }

    pages[pages.length - 1].ids.push(unit.id)
    unitPage.set(unit.id, pages.length)
    lastBottom = top + unit.height
    checkFooter(unit.id, lastBottom)
  }

  const orphanedHeadings: PrintLayout['orphanedHeadings'] = []
  units.forEach((unit, i) => {
    const next = units[i + 1]
    if (
      unit.isHeading &&
      next &&
      unitPage.get(next.id) !== unitPage.get(unit.id)
    ) {
      orphanedHeadings.push({ id: unit.id, page: unitPage.get(unit.id)! })
    }
  })

  const lastStart = pageStarts[pageStarts.length - 1]
  const lastPageFillPercent = Math.round(
    ((lastBottom - lastStart) / usable) * 100
  )
  const hints: string[] = []

  for (const heading of orphanedHeadings) {
    hints.push(
      `Heading ${heading.id} is stranded at the bottom of page ${heading.page}; add its section id to breakBefore or shorten page ${heading.page}.`
    )
  }
  for (const push of pushed.filter((p) => p.gapPercent >= 15)) {
    hints.push(
      `${push.id} was pushed to page ${push.toPage}, leaving ${push.gapPercent}% of page ${push.toPage - 1} empty; trim or hide bullets before it, use density "compact", or reduce fontScale.`
    )
  }
  for (const overlap of footerOverlaps) {
    hints.push(
      `${overlap.id} runs ${overlap.overlapPx}px under the footer on page ${overlap.page}; start it on the next page with breakBefore, or trim the content above it.`
    )
  }
  for (const split of splits) {
    hints.push(
      `${split.id} is split between pages ${split.page} and ${split.continuesOnPage}; add it to breakBefore or shorten the content around it.`
    )
  }
  if (targetPages && pages.length > targetPages) {
    hints.push(
      `The resume is ${pages.length} pages but should be ${targetPages}; the last page is ${lastPageFillPercent}% full. Hide or shorten content, or use density "compact".`
    )
  } else if (pages.length > 1 && lastPageFillPercent < 15) {
    hints.push(
      `The last page is only ${lastPageFillPercent}% full; trimming a little would save a page.`
    )
  }

  return {
    approximate: true,
    pageCount: pages.length,
    targetPages,
    usablePageHeightPx: Math.round(usable),
    lastPageFillPercent,
    pages,
    splits,
    pushed,
    orphanedHeadings,
    footerOverlaps,
    pageStarts: pageStarts.map(Math.round),
    hints,
  }
}

const nextFrame = (win: Window = window) =>
  new Promise<void>((resolve) => win.requestAnimationFrame(() => resolve()))

/** Switches the page into (or out of) the on-screen print preview. */
export function setPrintPreview(on: boolean) {
  document.documentElement.toggleAttribute('data-print-preview', on)
}

/** Clones the page, as currently tailored, into an iframe laid out like paper. */
async function createPrintFrame(): Promise<HTMLIFrameElement> {
  const clone = document.documentElement.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll('script, iframe, astro-dev-toolbar, astro-island')
    .forEach((el) => el.remove())
  clone.setAttribute('data-print-preview', '')
  const base = document.createElement('base')
  base.href = location.href
  clone.querySelector('head')?.prepend(base)

  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  Object.assign(frame.style, {
    position: 'fixed',
    top: '0',
    left: '-10000px',
    width: `${PAGE.widthIn}in`,
    height: `${PAGE.heightIn}in`,
    border: '0',
    visibility: 'hidden',
  })
  document.body.append(frame)

  const doc = frame.contentDocument!
  doc.open()
  doc.write(`<!doctype html>${clone.outerHTML}`)
  doc.close()

  const style = doc.createElement('style')
  style.textContent = `html { padding: 0 ${PAGE.marginSideIn}in !important; overflow: hidden !important; } html, body { background: none !important; }`
  doc.head.append(style)

  await Promise.all(
    [...doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(
      (link) =>
        link.sheet
          ? undefined
          : new Promise((resolve) => {
              link.addEventListener('load', resolve, { once: true })
              link.addEventListener('error', resolve, { once: true })
            })
    )
  )
  await doc.fonts?.ready
  await nextFrame(frame.contentWindow!)
  await nextFrame(frame.contentWindow!)
  return frame
}

/** Measures the resume as it would print and paginates it. */
export async function measurePrintLayout(
  targetPages?: number
): Promise<PrintLayout> {
  const frame = await createPrintFrame()

  try {
    const doc = frame.contentDocument!
    const win = frame.contentWindow!
    const root = doc.querySelector<HTMLElement>('[data-resume-root]')!
    const elements = [
      ...root.querySelectorAll<HTMLElement>('[data-print-unit]'),
    ].filter((el) => el.getClientRects().length > 0)
    const origin = elements[0]?.getBoundingClientRect().top ?? 0

    const units: Unit[] = elements.map((el) => {
      const rect = el.getBoundingClientRect()
      const style = win.getComputedStyle(el)
      const breakHost = el.closest('[data-tailor-break-before]')
      return {
        id: el.dataset.printUnit!,
        top: rect.top - origin,
        height: rect.height,
        avoidBreakInside:
          style.breakInside === 'avoid' ||
          style.getPropertyValue('page-break-inside') === 'avoid',
        breakBefore:
          Boolean(
            breakHost && breakHost.querySelector('[data-print-unit]') === el
          ) || el.hasAttribute('data-tailor-break-before'),
        isHeading: el.hasAttribute('data-print-heading'),
      }
    })

    const footer = root.querySelector<HTMLElement>('[data-print-footer]')
    return paginate(units, printableHeightPx(), {
      targetPages,
      footerHeight: footer?.getBoundingClientRect().height ?? 0,
    })
  } finally {
    frame.remove()
  }
}
