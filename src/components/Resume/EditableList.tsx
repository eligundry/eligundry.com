import type { ComponentChildren, JSX } from 'preact'
import { useContext } from 'preact/hooks'
import { cx, ResumeViewContext, useItemProps } from './ResumeView'
import { useBulletDrag } from './useBulletDrag'

// A list on the resume: a job's bullets, the skill lines, the activities or
// an activity's sub-items. In edit mode each item's marker is a handle for
// reordering it, a "×" removes it and a button adds an item.

type Item = { id: string; hidden?: boolean }

export default function EditableList<T extends Item>({
  parentId,
  items,
  class: className,
  addLabel,
  nested,
  printUnits,
  renderItem,
  renderSublist,
}: {
  /** The container the items are reordered and added in. */
  parentId: string
  items: T[]
  class?: string
  /** Label for the button that adds an item in edit mode. */
  addLabel: string
  /** A sub-list: its add button only shows while its parent is hovered. */
  nested?: boolean
  /** Measure each item as a block for print layout (`data-print-unit`). */
  printUnits?: boolean
  /** An item's content, inside its `<li>`. */
  renderItem: (item: T) => ComponentChildren
  /** A nested list under an item, after its remove button. */
  renderSublist?: (item: T) => ComponentChildren
}) {
  const { edit } = useContext(ResumeViewContext)
  const ids = items.map((item) => item.id)
  const shown = items.filter((item) => !item.hidden).map((item) => item.id)
  const drag = useBulletDrag(
    ids,
    shown,
    edit && ((next) => edit.moveItems(parentId, next))
  )

  return (
    <>
      {items.length > 0 && (
        <ul class={className}>
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              printUnit={printUnits}
              handle={drag.handleProps(item.id)}
              dragging={drag.dragging === item.id}
              dropBefore={drag.drop === item.id}
              dropAfter={
                drag.drop === 'end' && item.id === shown[shown.length - 1]
              }
              sublist={renderSublist?.(item)}
            >
              {renderItem(item)}
            </ListItem>
          ))}
        </ul>
      )}
      {edit && (
        <button
          type="button"
          class={cx(
            'tailor-add order-5 print:hidden',
            nested && 'tailor-add-nested'
          )}
          onClick={() => edit.addItem(parentId)}
        >
          + {addLabel}
        </button>
      )}
    </>
  )
}

function ListItem({
  item,
  printUnit,
  handle,
  dragging,
  dropBefore,
  dropAfter,
  sublist,
  children,
}: {
  item: Item
  printUnit?: boolean
  /** Props for the marker that drags the item, in edit mode. */
  handle: JSX.HTMLAttributes<HTMLButtonElement>
  dragging: boolean
  dropBefore: boolean
  dropAfter: boolean
  sublist?: ComponentChildren
  children: ComponentChildren
}) {
  const { visible, props } = useItemProps(item)
  const { edit } = useContext(ResumeViewContext)
  if (!visible) return null
  const unit = printUnit ? item.id : undefined
  if (!edit || item.hidden) {
    return (
      <li {...props} data-print-unit={unit}>
        {children}
        {sublist}
      </li>
    )
  }

  // The list marker becomes a handle: CSS markers can't be dragged, so it's
  // drawn by a button in the same place.
  return (
    <li
      {...props}
      data-print-unit={unit}
      class={cx(props.class, 'tailor-bullet')}
      data-dragging={dragging || undefined}
      data-drop-before={dropBefore || undefined}
      data-drop-after={dropAfter || undefined}
    >
      <button
        type="button"
        class="tailor-handle print:hidden"
        aria-label="Move item"
        title="Drag to reorder (or use the arrow keys)"
        {...handle}
      />
      {children}
      <button
        type="button"
        class="tailor-remove print:hidden"
        aria-label="Remove item"
        title="Remove item"
        onClick={() => edit.removeItem(item.id)}
      >
        ×
      </button>
      {sublist}
    </li>
  )
}
