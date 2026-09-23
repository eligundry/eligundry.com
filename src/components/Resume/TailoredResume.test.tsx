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
      markdown: 'Shipped a **React SDK**',
      reason: 'Lead with SDKs',
    })

    expect(rewrite.effective.html).toBe('Shipped a <strong>React SDK</strong>')
    await waitFor(() => expect(item('radioshack')).toBeNull())
    expect(item('chord:0')?.innerHTML).toBe(
      'Shipped a <strong>React SDK</strong>'
    )
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

  test('loads tailoring when the browser supports WebMCP', async () => {
    render(<Resume source={fixtureSource()} />)
    await waitFor(() => expect(tools.size).toBe(resumeTools.length))
    expect(await screen.findByText(/This resume supports/)).toBeTruthy()
  })
})
