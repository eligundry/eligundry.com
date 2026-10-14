// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/preact'
import { afterEach, describe, expect, test } from 'vitest'
import { fixtureSource } from '../../lib/resume/__fixtures__/source'
import { indexResume } from '../../lib/resume/model'
import {
  addChange,
  emptyState,
  tailor,
  type Op,
} from '../../lib/resumeTailor/state'
import ResumeView, { ResumeViewContext } from './ResumeView'
import { htmlToText } from './Experience'

afterEach(cleanup)

const base = fixtureSource()
const originals = indexResume(base)

function tailored(ops: Op[]) {
  const state = ops.reduce(
    (state, op) => addChange(base, state, op, 'because').state,
    emptyState()
  )
  return tailor(base, state)
}

function renderView(ops: Op[] = [], review = false) {
  const { source, print } = tailored(ops)
  return render(
    <ResumeViewContext.Provider
      value={{
        review,
        breakBefore: print.breakBefore,
        original: (id) =>
          (originals.get(id)?.node as { html?: string } | undefined)?.html,
      }}
    >
      <ResumeView resume={source} />
    </ResumeViewContext.Provider>
  )
}

const item = (container: Element, id: string) =>
  container.querySelector<HTMLElement>(`[data-resume-id="${id}"]`)

describe('ResumeView', () => {
  test('renders the resume', () => {
    renderView()
    expect(screen.getByRole('link', { name: 'Chord Commerce' })).toBeTruthy()
    expect(screen.getByText('React SDK').closest('li')?.textContent).toBe(
      'Built a React SDK.'
    )
    expect(screen.getByText('Fluent in', { exact: false }).textContent).toBe(
      'Fluent in TypeScript, Go, and PHP.'
    )
    expect(screen.queryByText('Summary')).toBeNull()
  })

  test('keeps jobs marked printHide off the printed resume', () => {
    const { container } = renderView()
    expect(item(container, 'radioshack')?.className).toContain('print:hidden')
    expect(item(container, 'chord')?.className).not.toContain('print:hidden')
  })

  test('leaves out hidden items', () => {
    const { container } = renderView([
      {
        type: 'setVisibility',
        ids: ['chord:1', 'section:skills'],
        visible: false,
      },
    ])
    expect(item(container, 'chord:0')).toBeTruthy()
    expect(item(container, 'chord:1')).toBeNull()
    expect(item(container, 'section:skills')).toBeNull()
  })

  test('strikes hidden items through in review mode', () => {
    const { container } = renderView(
      [{ type: 'setVisibility', ids: ['chord:1'], visible: false }],
      true
    )
    expect(item(container, 'chord:1')?.className).toBe('tailor-hidden')
  })

  test('shows rewrites next to the original in review mode', () => {
    const { container } = renderView(
      [{ type: 'rewrite', id: 'chord:0', markdown: 'Shipped **an SDK**' }],
      true
    )
    const bullet = within(item(container, 'chord:0')!)
    expect(bullet.getByText('React SDK').closest('del')).toBeTruthy()
    expect(bullet.getByText('an SDK').closest('ins')).toBeTruthy()
  })

  test('shows only the rewrite outside review mode', () => {
    const { container } = renderView([
      { type: 'rewrite', id: 'chord:0', markdown: 'Shipped **an SDK**' },
    ])
    expect(item(container, 'chord:0')?.firstElementChild?.innerHTML).toBe(
      'Shipped <strong>an SDK</strong>'
    )
  })

  test('escapes HTML in tailored text', () => {
    const { container } = renderView([
      {
        type: 'rewrite',
        id: 'chord:0',
        markdown: '<img src=x onerror=alert(1)>',
      },
    ])
    expect(item(container, 'chord:0')?.querySelector('img')).toBeNull()
    expect(item(container, 'chord:0')?.textContent).toBe(
      '<img src=x onerror=alert(1)>'
    )
  })

  test('renders sections and bullets in the tailored order', () => {
    const { container } = renderView([
      { type: 'reorder', container: 'sections', ids: ['section:skills'] },
      { type: 'reorder', container: 'chord', ids: ['chord:1'] },
    ])
    const sections = [
      ...container.querySelectorAll('[data-resume-id^="section:"]'),
    ].map((el) => el.getAttribute('data-resume-id'))
    expect(sections).toEqual([
      'section:skills',
      'section:work',
      'section:education',
      'section:activities',
    ])
    const bullets = [
      ...item(container, 'chord')!.querySelectorAll('li[data-resume-id]'),
    ].map((el) => el.getAttribute('data-resume-id'))
    expect(bullets).toEqual(['chord:1', 'chord:0'])
  })

  test('renders the tailored summary and skill keywords', () => {
    renderView([
      {
        type: 'rewrite',
        id: 'basics:summary',
        markdown: 'Staff **engineer**.',
      },
      {
        type: 'setSkillKeywords',
        id: 'skills:languages',
        keywords: [{ name: 'Go' }, { name: 'TypeScript' }],
      },
    ])
    expect(screen.getByText('Summary')).toBeTruthy()
    expect(screen.getByText('engineer').tagName).toBe('STRONG')
    expect(screen.getByText('Fluent in', { exact: false }).textContent).toBe(
      'Fluent in Go and TypeScript.'
    )
    expect(screen.getByRole('link', { name: 'Go' }).getAttribute('href')).toBe(
      'https://golang.org/'
    )
  })

  test('marks up skill keywords as Things the Person knowsAbout', () => {
    const { container } = renderView()
    const skills = item(container, 'skills:languages')!
    const things = [...skills.querySelectorAll('[itemprop="knowsAbout"]')]
    expect(things.map((thing) => thing.getAttribute('itemtype'))).toEqual([
      'https://schema.org/Thing',
      'https://schema.org/Thing',
      'https://schema.org/Thing',
    ])
    expect(
      things.map((thing) => [
        thing.querySelector('[itemprop="name"]')?.textContent,
        thing.querySelector('[itemprop="url"]')?.getAttribute('href'),
      ])
    ).toEqual([
      ['TypeScript', 'https://www.typescriptlang.org/'],
      ['Go', 'https://golang.org/'],
      ['PHP', 'https://www.php.net/'],
    ])
  })

  test("gives a job's role its summary and visible bullets as descriptions", () => {
    const { container } = renderView([
      {
        type: 'rewrite',
        id: 'chord:0',
        markdown: 'Built a [Go](https://golang.org/) & React SDK.',
      },
    ])
    const role = item(container, 'chord')!.querySelector(
      '[itemtype="https://schema.org/OrganizationRole"]'
    )!
    const descriptions = [
      ...role.querySelectorAll('meta[itemprop="description"]'),
    ].map((meta) => meta.getAttribute('content'))
    expect(descriptions).toContain('Built a Go & React SDK.')
    // The bullets themselves stay the Person's, for their knowsAbout links
    expect(item(container, 'chord:0')!.closest('[itemscope]')).toBeNull()
  })

  test('htmlToText decodes rendered markdown', () => {
    expect(htmlToText('<a href="x">A</a> &amp; B &lt;3 &#x27;s')).toBe(
      "A & B <3 's"
    )
  })

  test('marks up awards from their records, even after a rewrite', () => {
    const { container } = renderView([
      {
        type: 'rewrite',
        id: 'activities:eagle-scout',
        markdown: 'Became an Eagle Scout.',
      },
    ])
    const activity = item(container, 'activities:eagle-scout')!
    expect(
      activity.querySelector('meta[itemprop="award"]')?.getAttribute('content')
    ).toBe('Eagle Scout, Boy Scouts of America, 2006')
    const credential = activity.querySelector('[itemprop="hasCredential"]')!
    expect(credential.getAttribute('itemtype')).toBe(
      'https://schema.org/EducationalOccupationalCredential'
    )
    expect(
      [...credential.querySelectorAll('[itemprop]')].map((el) => [
        el.getAttribute('itemprop'),
        el.getAttribute('content') ?? el.getAttribute('href'),
      ])
    ).toEqual([
      ['name', 'Eagle Scout'],
      ['credentialCategory', 'rank'],
      ['url', 'https://en.wikipedia.org/wiki/Eagle_Scout'],
      ['dateCreated', '2006'],
      ['recognizedBy', null],
      ['name', 'Boy Scouts of America'],
      ['url', 'https://www.scouting.org/'],
    ])
  })

  test('marks forced page breaks', () => {
    const { container } = renderView([
      { type: 'setPrint', print: { breakBefore: ['section:education'] } },
    ])
    expect(
      item(container, 'section:education')?.hasAttribute(
        'data-tailor-break-before'
      )
    ).toBe(true)
  })
})

describe('promotions', () => {
  test('shows every title held at a job', () => {
    const source = fixtureSource()
    Object.assign(source.sections[0].items[0], {
      roles: [
        {
          title: 'Staff Software Engineer',
          startDate: '2023-01-01',
          endDate: '2023-11-27',
        },
        {
          title: 'Senior Software Engineer',
          startDate: '2022-02-07',
          endDate: '2023-01-01',
        },
      ],
    })
    const { container } = render(<ResumeView resume={source} />)
    const roles = [
      ...item(container, 'chord')!.querySelectorAll(
        '[itemtype="https://schema.org/OrganizationRole"]'
      ),
    ]
    expect(roles.map((role) => role.textContent)).toEqual([
      expect.stringMatching(
        /^Staff Software Engineer.*January 2023 — November 2023/
      ),
      expect.stringMatching(
        /^Senior Software Engineer.*February 2022 — January 2023/
      ),
    ])
  })
})
