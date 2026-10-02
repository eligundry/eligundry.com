import { useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'

// Reordering a list in edit mode: a job's bullets, the skill lines, the jobs
// in a section… Each item (marked `data-drag-item`) has a handle that can be
// dragged (mouse, touch or pen, through pointer events) or moved with the
// arrow keys.

/** Where a dragged bullet would land: before a bullet, or at the end. */
type Drop = string | 'end'

/** `ids` with `id` moved to just before `before` (or to the end). */
export function moveBefore(ids: string[], id: string, before: Drop): string[] {
  if (before === id) return ids
  const rest = ids.filter((other) => other !== id)
  const at = before === 'end' ? rest.length : rest.indexOf(before)
  rest.splice(at === -1 ? rest.length : at, 0, id)
  return rest
}

const sameOrder = (a: string[], b: string[]) => a.join('\n') === b.join('\n')

/** The item in the same list that a pointer at `y` would drop before. */
function dropAt(handle: Element, y: number): Drop {
  const items = handle
    .closest('[data-drag-item]')
    ?.parentElement?.querySelectorAll<HTMLElement>(':scope > [data-drag-item]')
  for (const item of items ?? []) {
    const { top, height } = item.getBoundingClientRect()
    if (y < top + height / 2) return item.dataset.resumeId!
  }
  return 'end'
}

const focusHandle = (id: string) =>
  requestAnimationFrame(() =>
    document
      .querySelector<HTMLElement>(`[data-resume-id="${id}"] > .tailor-handle`)
      ?.focus()
  )

/**
 * Drag state for a job's bullets. `ids` are all of them, in order, including
 * hidden ones (which keep their place); `visible` are the ones on the page.
 */
export function useBulletDrag(
  ids: string[],
  visible: string[],
  move: ((ids: string[]) => void) | undefined
) {
  const [drag, setDrag] = useState<{ id: string; drop?: Drop }>()
  // Pointer events can arrive before a re-render, so they read this.
  const current = useRef(drag)
  const update = (next: typeof drag) => {
    current.current = next
    setDrag(next)
  }

  const commit = (id: string, drop: Drop) => {
    const next = moveBefore(ids, id, drop)
    if (!sameOrder(next, ids)) move?.(next)
  }

  // Only show where a bullet would land when that would move it.
  const drop =
    drag?.drop && !sameOrder(moveBefore(ids, drag.id, drag.drop), ids)
      ? drag.drop
      : undefined

  const handleProps = (id: string): JSX.HTMLAttributes<HTMLButtonElement> => ({
    onPointerDown(event) {
      if (event.button !== 0) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      update({ id })
    },
    onPointerMove(event) {
      if (current.current?.id !== id) return
      const drop = dropAt(event.currentTarget, event.clientY)
      if (drop !== current.current.drop) update({ id, drop })
    },
    onPointerUp() {
      const ended = current.current
      if (ended?.id !== id) return
      update(undefined)
      if (ended.drop) commit(id, ended.drop)
    },
    onPointerCancel() {
      update(undefined)
    },
    onKeyDown(event) {
      const index = visible.indexOf(id)
      let target: Drop | undefined
      if (event.key === 'ArrowUp' && index > 0) target = visible[index - 1]
      if (event.key === 'ArrowDown' && index < visible.length - 1)
        target = visible[index + 2] ?? 'end'
      if (!target) return
      event.preventDefault()
      commit(id, target)
      focusHandle(id)
    },
  })

  return { dragging: drag?.id, drop, handleProps }
}
