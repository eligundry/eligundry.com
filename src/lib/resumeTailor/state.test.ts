import { describe, expect, test } from 'vitest'
import { fixtureSource } from '../resume/__fixtures__/source'
import {
  editableMarkdown,
  indexResume,
  type ActivityNode,
  type ExperienceNode,
  type SkillNode,
} from '../resume/model'
import {
  addChange,
  addManualItem,
  addManualEdit,
  emptyState,
  newItemId,
  removeManualItem,
  reorderManually,
  revertChange,
  setPrintedManually,
  tailor,
  TailorError,
  type Op,
  type TailorState,
} from './state'

const base = fixtureSource()

function apply(ops: Op[], state: TailorState = emptyState()) {
  for (const op of ops) {
    state = addChange(base, state, op, 'because').state
  }
  return { state, tailored: tailor(base, state) }
}

const node = <T>(tailored: ReturnType<typeof tailor>, id: string) =>
  indexResume(tailored.source).get(id)?.node as T

describe('tailor', () => {
  test('never mutates the base resume', () => {
    apply([{ type: 'rewrite', id: 'chord:0', markdown: 'New' }])
    expect(base.sections[0].items[0]).toMatchObject({
      highlights: [{ markdown: 'Built a [React SDK](https://x.dev).' }, {}],
    })
  })

  test('hides and shows things', () => {
    const { tailored } = apply([
      {
        type: 'setVisibility',
        ids: ['chord:1', 'section:skills'],
        visible: false,
      },
    ])
    expect(node<{ hidden: boolean }>(tailored, 'chord:1').hidden).toBe(true)
    expect(tailored.source.sections[2].hidden).toBe(true)
  })

  test('showing a print-hidden job keeps it off the printed resume', () => {
    const { tailored } = apply([
      { type: 'setVisibility', ids: ['radioshack'], visible: true },
    ])
    expect(node<ExperienceNode>(tailored, 'radioshack').printHide).toBe(true)
  })

  test('puts a job on the printed resume, or leaves it off', () => {
    let { tailored } = apply([
      {
        type: 'setVisibility',
        ids: ['radioshack'],
        visible: true,
        print: true,
      },
      { type: 'setVisibility', ids: ['chord'], visible: false, print: true },
    ])
    expect(node<ExperienceNode>(tailored, 'radioshack').printHide).toBe(false)
    expect(node<ExperienceNode>(tailored, 'chord').printHide).toBe(true)
    expect(node<ExperienceNode>(tailored, 'chord').hidden).toBeUndefined()
    expect(() =>
      apply([
        {
          type: 'setVisibility',
          ids: ['chord:0'],
          visible: false,
          print: true,
        },
      ])
    ).toThrow(/Only jobs and schools/)
  })

  test('reorders, keeping unlisted ids after the listed ones', () => {
    const { tailored } = apply([
      { type: 'reorder', container: 'sections', ids: ['section:skills'] },
      { type: 'reorder', container: 'chord', ids: ['chord:1'] },
    ])
    expect(tailored.source.sections.map((s) => s.id)).toEqual([
      'section:skills',
      'section:work',
      'section:education',
      'section:activities',
    ])
    expect(
      node<ExperienceNode>(tailored, 'chord').highlights.map((h) => h.id)
    ).toEqual(['chord:1', 'chord:0'])
  })

  test('rejects reorders with ids from elsewhere', () => {
    expect(() =>
      addChange(
        base,
        emptyState(),
        { type: 'reorder', container: 'chord', ids: ['radioshack'] },
        ''
      )
    ).toThrow(/not in "chord"/)
  })

  test('rewrites text and logs before/after', () => {
    const { tailored } = apply([
      { type: 'rewrite', id: 'chord:0', markdown: 'Shipped an SDK' },
      {
        type: 'rewrite',
        id: 'section:work:title',
        markdown: 'Relevant Experience',
      },
      { type: 'rewrite', id: 'basics:summary', markdown: 'Staff engineer.' },
    ])
    expect(node<{ markdown: string }>(tailored, 'chord:0').markdown).toBe(
      'Shipped an SDK'
    )
    expect(tailored.source.sections[0].title).toBe('Relevant Experience')
    expect(tailored.source.basics.summary.markdown).toBe('Staff engineer.')
    expect(tailored.log[0]).toMatchObject({
      before: 'Built a [React SDK](https://x.dev).',
      after: 'Shipped an SDK',
      reason: 'because',
    })
  })

  test('renders rewritten text as escaped HTML', () => {
    const { tailored } = apply([
      {
        type: 'rewrite',
        id: 'chord:0',
        markdown: 'Built **SDKs** <script>alert(1)</script>',
      },
    ])
    expect(node<{ html: string }>(tailored, 'chord:0').html).toBe(
      'Built <strong>SDKs</strong> &lt;script&gt;alert(1)&lt;/script&gt;'
    )
  })

  test('adds a summary to a job that lacks one', () => {
    const { tailored } = apply([
      {
        type: 'rewrite',
        id: 'chord:summary',
        markdown: 'E-commerce platform.',
      },
    ])
    expect(node<ExperienceNode>(tailored, 'chord').summary).toMatchObject({
      markdown: 'E-commerce platform.',
      added: true,
    })
  })

  test('facts are locked', () => {
    expect(() =>
      addChange(
        base,
        emptyState(),
        { type: 'rewrite', id: 'chord', markdown: 'CTO' },
        ''
      )
    ).toThrow(TailorError)
  })

  test('adds bullets, skills and activities', () => {
    let state = emptyState()
    const bullet = newItemId('chord', state)
    state = addChange(
      base,
      state,
      {
        type: 'addItem',
        parentId: 'chord',
        id: bullet,
        markdown: 'Led **GraphQL** migration',
        after: 'chord:0',
      },
      'r'
    ).state
    const skill = newItemId('section:skills', state)
    state = addChange(
      base,
      state,
      {
        type: 'addItem',
        parentId: 'section:skills',
        id: skill,
        markdown: 'Comfortable with Kubernetes.',
      },
      'r'
    ).state

    expect(bullet).toBe('chord:+1')
    expect(skill).toBe('skills:+2')
    const tailored = tailor(base, state)
    expect(
      node<ExperienceNode>(tailored, 'chord').highlights.map((h) => h.id)
    ).toEqual(['chord:0', 'chord:+1', 'chord:1'])
    expect(node<SkillNode>(tailored, skill).markdown).toBe(
      'Comfortable with Kubernetes.'
    )
  })

  test('sets skill keywords, keeping known links', () => {
    const { tailored } = apply([
      {
        type: 'setSkillKeywords',
        id: 'skills:languages',
        keywords: [
          { name: 'Go' },
          { name: 'react' },
          { name: 'Rust', url: 'javascript:x' },
        ],
      },
    ])
    expect(node<SkillNode>(tailored, 'skills:languages').keywords).toEqual([
      { name: 'Go', url: 'https://golang.org/' },
      { name: 'react', url: 'https://reactjs.org/' },
      { name: 'Rust', url: undefined },
    ])
  })

  test('validates print options', () => {
    expect(() =>
      addChange(
        base,
        emptyState(),
        { type: 'setPrint', print: { breakBefore: ['nope'] } },
        ''
      )
    ).toThrow(/Unknown id/)
    expect(() =>
      addChange(
        base,
        emptyState(),
        { type: 'setPrint', print: { fontScale: 2 } },
        ''
      )
    ).toThrow(/fontScale/)
    const { tailored } = apply([
      {
        type: 'setPrint',
        print: { breakBefore: ['section:education'], density: 'compact' },
      },
    ])
    expect(tailored.print).toMatchObject({
      breakBefore: ['section:education'],
      density: 'compact',
      fontScale: 1,
    })
  })

  test('reverting a change in the middle keeps later changes', () => {
    const { state } = apply([
      { type: 'rewrite', id: 'chord:0', markdown: 'First' },
      { type: 'setVisibility', ids: ['chord:1'], visible: false },
      { type: 'rewrite', id: 'chord:0', markdown: 'Second' },
    ])
    const tailored = tailor(base, revertChange(state, 'c2'))
    expect(node<{ hidden?: boolean }>(tailored, 'chord:1').hidden).toBeFalsy()
    expect(node<{ markdown: string }>(tailored, 'chord:0').markdown).toBe(
      'Second'
    )
    expect(tailored.log.map((c) => c.id)).toEqual(['c1', 'c3'])
  })

  test('changes that no longer apply after a revert are reported, not thrown', () => {
    let state = emptyState()
    const id = newItemId('chord', state)
    state = apply([
      { type: 'addItem', parentId: 'chord', id, markdown: 'New bullet' },
      { type: 'rewrite', id, markdown: 'Edited new bullet' },
    ]).state
    const tailored = tailor(base, revertChange(state, 'c1'))
    expect(tailored.log[0].error).toMatch(/Unknown id/)
  })

  test('added item ids never collide after reverts', () => {
    let state = emptyState()
    for (let i = 0; i < 2; i++) {
      state = addChange(
        base,
        state,
        {
          type: 'addItem',
          parentId: 'chord',
          id: newItemId('chord', state),
          markdown: `Bullet ${i}`,
        },
        ''
      ).state
    }
    state = revertChange(state, 'c1')
    expect(newItemId('chord', state)).toBe('chord:+3')
  })
})

describe('addManualEdit', () => {
  test('records hand edits, replacing one made just before in the same place', () => {
    let { state } = addManualEdit(base, emptyState(), 'chord:0', 'One')
    ;({ state } = addManualEdit(base, state, 'chord:0', 'Two'))
    expect(state.changes).toEqual([
      expect.objectContaining({
        id: 'c1',
        op: { type: 'rewrite', id: 'chord:0', markdown: 'Two' },
        reason: 'Edited by hand',
        manual: true,
      }),
    ])
    ;({ state } = addManualEdit(base, state, 'chord:1', 'Three'))
    ;({ state } = addManualEdit(base, state, 'chord:0', 'Four'))
    expect(tailor(base, state).log.at(-1)).toMatchObject({
      id: 'c3',
      before: 'Two',
      after: 'Four',
      manual: true,
    })
  })

  test("doesn't replace an agent's change", () => {
    const { state } = apply([{ type: 'rewrite', id: 'chord:0', markdown: 'A' }])
    const next = addManualEdit(base, state, 'chord:0', 'B').state
    expect(next.changes.map((c) => c.manual)).toEqual([undefined, true])
  })

  test('throws without recording anything for text that can not be edited', () => {
    expect(() => addManualEdit(base, emptyState(), 'chord', 'CTO')).toThrow(
      TailorError
    )
  })
})

describe('adding and removing bullets by hand', () => {
  const bullets = (state: TailorState) =>
    node<ExperienceNode>(tailor(base, state), 'chord')
      .highlights.filter((h) => !h.hidden)
      .map((h) => h.markdown)

  test('adds a bullet, and editing it updates the change that added it', () => {
    let { state, id } = addManualItem(base, emptyState(), 'chord')
    expect(id).toBe('chord:+1')
    expect(state.changes).toEqual([
      expect.objectContaining({
        op: { type: 'addItem', parentId: 'chord', id, markdown: '' },
        reason: 'Added by hand',
        manual: true,
      }),
    ])
    ;({ state } = addManualEdit(base, state, id, 'Shipped it.'))
    ;({ state } = addManualEdit(base, state, id, 'Shipped it fast.'))
    expect(state.changes).toHaveLength(1)
    expect(bullets(state).at(-1)).toBe('Shipped it fast.')
  })

  test('a bullet added by hand and left empty is dropped', () => {
    const { state, id } = addManualItem(base, emptyState(), 'chord')
    expect(addManualEdit(base, state, id, '').state.changes).toEqual([])
  })

  test('removing a bullet added by hand drops it and its changes', () => {
    let { state, id } = addManualItem(base, emptyState(), 'chord')
    ;({ state } = addManualEdit(base, state, id, 'Shipped it.'))
    expect(removeManualItem(base, state, id).state.changes).toEqual([])
  })

  test('removing a bullet from the content hides it, which can be reverted', () => {
    const { state } = removeManualItem(base, emptyState(), 'chord:0')
    expect(state.changes).toEqual([
      expect.objectContaining({
        op: { type: 'setVisibility', ids: ['chord:0'], visible: false },
        reason: 'Removed by hand',
        manual: true,
      }),
    ])
    expect(bullets(state)).toEqual([
      'Wrote <abbr title="docs">docs</abbr> &amp; more.',
    ])
    expect(bullets(revertChange(state, state.changes[0].id))).toHaveLength(2)
  })
})

describe('reorderManually', () => {
  const order = (state: TailorState) =>
    node<ExperienceNode>(tailor(base, state), 'chord').highlights.map(
      (h) => h.id
    )

  test('records a hand reorder, replacing the last one in the same job', () => {
    let { state } = reorderManually(base, emptyState(), 'chord', [
      'chord:1',
      'chord:0',
    ])
    ;({ state } = reorderManually(base, state, 'chord', ['chord:0', 'chord:1']))
    expect(state.changes).toEqual([
      expect.objectContaining({
        id: 'c1',
        op: {
          type: 'reorder',
          container: 'chord',
          ids: ['chord:0', 'chord:1'],
        },
        reason: 'Reordered by hand',
        manual: true,
      }),
    ])
  })

  test('dropping a reordered bullet added by hand keeps the rest of the order', () => {
    let { state, id } = addManualItem(base, emptyState(), 'chord')
    ;({ state } = addManualEdit(base, state, id, 'New.'))
    ;({ state } = reorderManually(base, state, 'chord', [
      id,
      'chord:1',
      'chord:0',
    ]))
    ;({ state } = removeManualItem(base, state, id))

    expect(tailor(base, state).log.filter((c) => c.error)).toEqual([])
    expect(order(state)).toEqual(['chord:1', 'chord:0'])
  })
})

describe('editing skills, activities and sub-items by hand', () => {
  const ids = (state: TailorState, sectionId: string) =>
    tailor(base, state)
      .source.sections.find((s) => s.id === sectionId)!
      .items.filter((item) => !item.hidden)
      .map((item) => item.id)
  const children = (state: TailorState) =>
    node<ActivityNode>(tailor(base, state), 'activities:talks')
      .children!.filter((c) => !c.hidden)
      .map((c) => c.markdown)

  test('reorders and removes skill lines and activities', () => {
    let { state } = reorderManually(base, emptyState(), 'section:skills', [
      'skills:frameworks',
      'skills:languages',
    ])
    ;({ state } = removeManualItem(base, state, 'activities:eagle-scout'))
    expect(ids(state, 'section:skills')).toEqual([
      'skills:frameworks',
      'skills:languages',
    ])
    expect(ids(state, 'section:activities')).toEqual([
      'activities:album-mode',
      'activities:talks',
    ])
  })

  test('adds, edits, reorders and removes sub-items', () => {
    let { state, id } = addManualItem(base, emptyState(), 'activities:talks')
    expect(id).toBe('activities:talks:+1')
    ;({ state } = addManualEdit(base, state, id, 'The NYC Vim Meetup'))
    ;({ state } = addManualEdit(
      base,
      state,
      'activities:talks:child:0',
      '[Remix NYC](https://remix.run/)'
    ))
    expect(editableMarkdown(tailor(base, state).source, id)).toBe(
      'The NYC Vim Meetup'
    )
    ;({ state } = reorderManually(base, state, 'activities:talks', [
      id,
      'activities:talks:child:1',
    ]))
    ;({ state } = removeManualItem(base, state, 'activities:talks:child:1'))
    expect(children(state)).toEqual([
      'The NYC Vim Meetup',
      '[Remix NYC](https://remix.run/)',
    ])
  })

  test('starts a sub-list under an activity without one', () => {
    let { state, id } = addManualItem(
      base,
      emptyState(),
      'activities:album-mode'
    )
    ;({ state } = addManualEdit(base, state, id, 'Built with Remix'))
    expect(
      node<ActivityNode>(
        tailor(base, state),
        'activities:album-mode'
      ).children?.map((c) => c.markdown)
    ).toEqual(['Built with Remix'])
  })

  test('dropping an activity added by hand drops its sub-items', () => {
    let { state, id } = addManualItem(base, emptyState(), 'section:activities')
    ;({ state } = addManualEdit(base, state, id, 'Ran a meetup'))
    const sub = addManualItem(base, state, id)
    ;({ state } = addManualEdit(base, sub.state, sub.id, 'Monthly'))
    expect(removeManualItem(base, state, id).state.changes).toEqual([])
  })
})

describe('setPrintedManually', () => {
  test('toggles a job on and off the printed resume', () => {
    let { state } = setPrintedManually(base, emptyState(), 'radioshack', true)
    expect(state.changes).toEqual([
      expect.objectContaining({
        op: {
          type: 'setVisibility',
          ids: ['radioshack'],
          visible: true,
          print: true,
        },
        manual: true,
      }),
    ])
    expect(
      node<ExperienceNode>(tailor(base, state), 'radioshack').printHide
    ).toBe(false)
    // Toggling straight back undoes it.
    ;({ state } = setPrintedManually(base, state, 'radioshack', false))
    expect(state.changes).toEqual([])
  })
})
