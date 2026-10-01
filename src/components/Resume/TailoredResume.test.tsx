// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fixtureSource } from '../../lib/resume/__fixtures__/source'
import Resume from './Resume'
import TailoredResume from './TailoredResume'
import { resumeTools } from './tools'

interface RegisteredTool {
  name: string
  execute: (
    input: unknown
  ) => Promise<{ content: { text: string }[]; isError?: boolean }>
}

let tools: Map<string, RegisteredTool>

/** A minimal `document.modelContext`, as a browser or extension provides. */
function stubModelContext() {
  tools = new Map()
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: {
      registerTool(tool: RegisteredTool, { signal }: { signal: AbortSignal }) {
        tools.set(tool.name, tool)
        signal.addEventListener('abort', () => tools.delete(tool.name))
      },
    },
  })
}

async function call(name: string, input: unknown = {}) {
  const result = await tools.get(name)!.execute(input)
  const text = result.content[0].text
  if (result.isError) throw new Error(text)
  return JSON.parse(text)
}

async function renderTailored() {
  const view = render(<TailoredResume source={fixtureSource()} />)
  await waitFor(() => expect(tools.size).toBe(resumeTools.length))
  return view
}

// preact/compat listens for focusin and focusout, which browsers fire along
// with focus and blur but Testing Library's focus() and blur() don't.
const focus = (element: HTMLElement) =>
  fireEvent(element, new FocusEvent('focusin', { bubbles: true }))
const leave = (element: HTMLElement) =>
  fireEvent(element, new FocusEvent('focusout', { bubbles: true }))

/** In edit mode, the editable text of a bullet (beside its remove button). */
const editable = (id: string) =>
  document.querySelector<HTMLElement>(
    `[data-resume-id="${id}"] .tailor-editable`
  )

const item = (id: string) =>
  document.querySelector<HTMLElement>(`[data-resume-id="${id}"]`)

beforeEach(() => {
  history.replaceState(null, '', '/resume/')
  stubModelContext()
})

afterEach(() => {
  cleanup()
  delete (document as { modelContext?: unknown }).modelContext
})

describe('TailoredResume', () => {
  test('registers the tools and describes the resume', async () => {
    await renderTailored()
    const { resume, changeCount } = await call('get_resume')
    expect(changeCount).toBe(0)
    expect(resume.work.map((job: { 'x-id': string }) => job['x-id'])).toEqual([
      'chord',
      'radioshack',
    ])
    expect(screen.getByText(/This resume supports/)).toBeTruthy()
  })

  test('tailors the page and lists every change with its reason', async () => {
    await renderTailored()
    await call('set_job_context', { company: 'Acme', title: 'Staff Engineer' })
    await call('set_visibility', {
      ids: ['radioshack'],
      visible: false,
      reason: 'Not relevant',
    })
    const rewrite = await call('rewrite', {
      id: 'chord:0',
      markdown: 'Shipped a [React](https://reactjs.org/) SDK.',
      reason: 'Lead with SDKs',
    })

    const html =
      'Shipped a <a href="https://reactjs.org/" itemprop="knowsAbout">React</a> SDK.'
    expect(rewrite.effective.html).toBe(html)
    expect(rewrite.warnings).toBeUndefined()
    await waitFor(() => expect(item('radioshack')).toBeNull())
    expect(item('chord:0')?.innerHTML).toBe(html)
    expect(screen.getByText('Tailored for Staff Engineer at Acme')).toBeTruthy()
    expect(screen.getByText('Lead with SDKs')).toBeTruthy()
    expect(document.title).toContain('Acme Staff Engineer')

    const exported = await call('export_json_resume')
    expect(exported.work.map((job: { name: string }) => job.name)).toEqual([
      'Chord Commerce',
    ])
  })

  test('reverts one change from the panel', async () => {
    await renderTailored()
    await call('set_visibility', {
      ids: ['radioshack'],
      visible: false,
      reason: 'Not relevant',
    })
    await call('rewrite', { id: 'chord:0', markdown: 'New', reason: 'x' })
    await waitFor(() => expect(item('radioshack')).toBeNull())

    fireEvent.click(screen.getAllByRole('button', { name: 'Revert' })[0])

    await waitFor(() => expect(item('radioshack')).toBeTruthy())
    expect(item('chord:0')?.textContent).toBe('New')
  })

  test('shows the original next to rewrites in review mode', async () => {
    await renderTailored()
    await call('rewrite', { id: 'chord:0', markdown: 'New', reason: 'x' })
    fireEvent.click(await screen.findByLabelText('Show changes on the page'))

    await waitFor(() =>
      expect(item('chord:0')?.querySelector('del')?.textContent).toBe(
        'Built a React SDK.'
      )
    )
    expect(item('chord:0')?.querySelector('ins')?.textContent).toBe('New')
  })

  test('gives agents the writing guidelines and technologies', async () => {
    await renderTailored()
    const { guidelines, resume } = await call('get_resume')
    expect(guidelines).toMatch(/Light touch/)
    expect(guidelines).toMatch(/No bold or italics/)
    expect(resume['x-technologies']).toContainEqual({
      name: 'React',
      url: 'https://reactjs.org/',
    })
  })

  test('rejects bold and italics from agents', async () => {
    await renderTailored()
    for (const markdown of ['Built a **React SDK**.', 'Built a *React SDK*.']) {
      await expect(
        call('rewrite', { id: 'chord:0', markdown, reason: 'x' })
      ).rejects.toThrow(/Bold and italics/)
    }
    await expect(
      call('add_item', { parentId: 'chord', markdown: '__New__', reason: 'x' })
    ).rejects.toThrow(/Bold and italics/)
    expect((await call('get_resume')).changeCount).toBe(0)
  })

  test('warns about writing that does not sound like the resume', async () => {
    await renderTailored()
    const { warnings } = await call('rewrite', {
      id: 'chord:0',
      markdown:
        'Spearheaded a robust React SDK in TypeScript that was adopted by every client team.',
      reason: 'x',
    })
    expect(warnings).toEqual([
      expect.stringMatching(
        /^Link these technologies: TypeScript \(https:\/\/www\.typescriptlang\.org\/\), React/
      ),
      expect.stringMatching(/"spearheaded", "robust" reads as filler/),
      expect.stringMatching(/longer than the original/),
    ])
  })

  test('edits text by hand', async () => {
    await renderTailored()
    fireEvent.click(
      await screen.findByRole('button', { name: 'Edit this resume' })
    )
    const bullet = await waitFor(() => {
      const element = editable('chord:0')
      expect(element).toBeTruthy()
      return element!
    })
    // Only the text being edited is contenteditable.
    expect(bullet.getAttribute('tabindex')).toBe('0')
    expect(bullet.hasAttribute('contenteditable')).toBe(false)

    focus(bullet)
    expect(bullet.getAttribute('contenteditable')).toBe('plaintext-only')
    expect(bullet.textContent).toBe('Built a [React SDK](https://x.dev).')
    bullet.textContent = 'Built a [React SDK](https://x.dev) for 40 stores.'
    leave(bullet)

    await waitFor(() =>
      expect(bullet.innerHTML).toBe(
        'Built a <a href="https://x.dev">React SDK</a> for 40 stores.'
      )
    )
    expect(bullet.hasAttribute('contenteditable')).toBe(false)
    expect(screen.getByText('by hand')).toBeTruthy()

    // Editing the same text again updates that change instead of adding one.
    focus(bullet)
    bullet.textContent = 'Built a React SDK for 40 stores.'
    leave(bullet)
    await waitFor(() =>
      expect(bullet.textContent).toBe('Built a React SDK for 40 stores.')
    )
    expect((await call('get_changes')).length).toBe(1)

    // Escape cancels.
    focus(bullet)
    bullet.textContent = 'Nope'
    fireEvent.keyDown(bullet, { key: 'Escape' })
    leave(bullet)
    await waitFor(() =>
      expect(bullet.textContent).toBe('Built a React SDK for 40 stores.')
    )

    fireEvent.click(screen.getByRole('button', { name: 'Revert' }))
    await waitFor(() =>
      expect(editable('chord:0')?.textContent).toBe('Built a React SDK.')
    )
  })

  test('adds a bullet by hand', async () => {
    render(<TailoredResume source={fixtureSource()} editing />)
    fireEvent.click((await screen.findAllByText('+ Add bullet'))[0])

    // The new bullet starts out being edited.
    const bullet = await waitFor(() => {
      const element = editable('chord:+1')
      expect(element?.getAttribute('contenteditable')).toBe('plaintext-only')
      return element!
    })
    bullet.textContent = 'Cut checkout time in half.'
    leave(bullet)

    await waitFor(() =>
      expect(bullet.textContent).toBe('Cut checkout time in half.')
    )
    fireEvent.click(screen.getByText(/1 change/))
    expect(screen.getByText('Added by hand')).toBeTruthy()
    expect(
      [...document.querySelectorAll('[data-resume-id^="chord:"]')].map((li) =>
        li.getAttribute('data-resume-id')
      )
    ).toEqual(['chord:0', 'chord:1', 'chord:+1'])
  })

  test('drops a new bullet left empty', async () => {
    render(<TailoredResume source={fixtureSource()} editing />)
    fireEvent.click((await screen.findAllByText('+ Add bullet'))[0])
    const bullet = await waitFor(() => {
      const element = editable('chord:+1')
      expect(element?.getAttribute('contenteditable')).toBe('plaintext-only')
      return element!
    })
    leave(bullet)
    await waitFor(() => expect(item('chord:+1')).toBeNull())
    expect(screen.getByText('0 changes')).toBeTruthy()
  })

  test('removes a bullet by hand and reverts it', async () => {
    render(<TailoredResume source={fixtureSource()} editing />)
    const [remove] = await screen.findAllByRole('button', {
      name: 'Remove bullet',
    })
    fireEvent.click(remove)

    await waitFor(() => expect(item('chord:0')).toBeNull())
    fireEvent.click(screen.getByText(/1 change/))
    expect(screen.getByText('Removed by hand')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Revert' }))
    await waitFor(() => expect(item('chord:0')).toBeTruthy())
  })

  test('edits inline HTML from the content as markdown', async () => {
    render(<TailoredResume source={fixtureSource()} editing />)
    const bullet = await waitFor(() => {
      const element = editable('chord:1')
      expect(element).toBeTruthy()
      return element!
    })

    focus(bullet)
    expect(bullet.textContent).toBe('Wrote docs &amp; more.')
    bullet.textContent = 'Wrote [docs](https://docs.dev) &amp; more.'
    leave(bullet)

    await waitFor(() =>
      expect(bullet.innerHTML).toBe(
        'Wrote <a href="https://docs.dev">docs</a> &amp; more.'
      )
    )
  })

  test('reorders bullets with their handles', async () => {
    render(<TailoredResume source={fixtureSource()} editing />)
    const order = () =>
      [...document.querySelectorAll('[data-resume-id^="chord:"]')].map((li) =>
        li.getAttribute('data-resume-id')
      )
    const handle = (id: string) =>
      document.querySelector<HTMLElement>(
        `[data-resume-id="${id}"] .tailor-handle`
      )!
    await waitFor(() => expect(handle('chord:0')).toBeTruthy())

    fireEvent.keyDown(handle('chord:0'), { key: 'ArrowDown' })
    await waitFor(() => expect(order()).toEqual(['chord:1', 'chord:0']))
    fireEvent.click(screen.getByText(/1 change/))
    expect(screen.getByText('Reordered by hand')).toBeTruthy()

    // Moving again updates the same change.
    fireEvent.keyDown(handle('chord:1'), { key: 'ArrowDown' })
    await waitFor(() => expect(order()).toEqual(['chord:0', 'chord:1']))
    expect(screen.getByText(/1 change/)).toBeTruthy()

    // Nowhere to go: nothing changes.
    fireEvent.keyDown(handle('chord:0'), { key: 'ArrowUp' })
    expect(order()).toEqual(['chord:0', 'chord:1'])

    fireEvent.click(screen.getByRole('button', { name: 'Revert' }))
    await waitFor(() => expect(screen.getByText('0 changes')).toBeTruthy())
    expect(order()).toEqual(['chord:0', 'chord:1'])
  })

  test('returns invalid changes as tool errors', async () => {
    await renderTailored()
    await expect(
      call('rewrite', { id: 'chord', markdown: 'CTO', reason: 'x' })
    ).rejects.toThrow(/locked/)
    await expect(
      call('set_visibility', { ids: ['nope'], visible: false, reason: 'x' })
    ).rejects.toThrow(/Unknown id/)
    expect((await call('get_resume')).changeCount).toBe(0)
  })

  test('saves the tailoring in the URL and restores it', async () => {
    const { unmount } = await renderTailored()
    await call('rewrite', { id: 'chord:0', markdown: 'Restored', reason: 'x' })
    const { url } = await call('get_share_url')
    await waitFor(() => expect(location.href).toBe(url))
    unmount()

    await renderTailored()
    await waitFor(() => expect(item('chord:0')?.textContent).toBe('Restored'))
  })

  test('unregisters the tools when unmounted', async () => {
    const { unmount } = await renderTailored()
    unmount()
    expect(tools.size).toBe(0)
  })

  test('resets everything', async () => {
    await renderTailored()
    await call('rewrite', { id: 'chord:0', markdown: 'New', reason: 'x' })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fireEvent.click(await screen.findByRole('button', { name: 'Reset' }))

    await waitFor(() =>
      expect(item('chord:0')?.textContent).toBe('Built a React SDK.')
    )
    expect(location.hash).toBe('')
  })
})

describe('Resume', () => {
  test('renders the plain resume without loading tailoring', async () => {
    delete (document as { modelContext?: unknown }).modelContext
    render(<Resume source={fixtureSource()} />)
    expect(item('chord:0')?.textContent).toBe('Built a React SDK.')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.queryByText(/This resume supports/)).toBeNull()
    expect(screen.queryByLabelText('Tailoring')).toBeNull()
  })

  test('opens for editing from the edit button', async () => {
    delete (document as { modelContext?: unknown }).modelContext
    render(<Resume source={fixtureSource()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit this resume' }))
    expect(await screen.findByText('Editing')).toBeTruthy()
    await waitFor(() => expect(editable('chord:0')).toBeTruthy())
    expect(
      screen.queryByRole('button', { name: 'Edit this resume' })
    ).toBeNull()
  })

  test('opens for editing from an #edit link', async () => {
    delete (document as { modelContext?: unknown }).modelContext
    history.replaceState(null, '', '/resume/#edit')
    render(<Resume source={fixtureSource()} />)
    expect(await screen.findByText('Editing')).toBeTruthy()
    await waitFor(() => expect(location.hash).toBe(''))
  })

  test('loads tailoring when the browser supports WebMCP', async () => {
    render(<Resume source={fixtureSource()} />)
    await waitFor(() => expect(tools.size).toBe(resumeTools.length))
    expect(await screen.findByText(/This resume supports/)).toBeTruthy()
  })
})
