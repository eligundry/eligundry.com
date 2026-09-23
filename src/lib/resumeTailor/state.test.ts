import { describe, expect, test } from 'vitest'
import { fixtureSource } from '../resume/__fixtures__/source'
import {
  indexResume,
  type ExperienceNode,
  type SkillNode,
} from '../resume/model'
import {
  addChange,
  emptyState,
  newItemId,
  revertChange,
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

  test('showing a print-hidden job puts it back in print', () => {
    const { tailored } = apply([
      { type: 'setVisibility', ids: ['radioshack'], visible: true },
    ])
    expect(node<ExperienceNode>(tailored, 'radioshack').printHide).toBe(false)
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
