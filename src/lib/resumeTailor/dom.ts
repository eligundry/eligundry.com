import {
  indexResume,
  type ActivityNode,
  type ExperienceNode,
  type ResumeSource,
  type SkillNode,
  type TextNode,
} from '../resume/model'
import escapeRegExp from 'lodash/escapeRegExp'
import {
  EXPERIENCE_LIST_CLASS,
  EXPERIENCE_SUMMARY_CLASS,
} from '../../components/Resume/classes'
import { renderInlineMarkdown, skillLineHtml } from '../resume/markdown'
import type { Tailored } from './state'

// Applies a tailored resume to the statically rendered page. The page markup
// carries the ids from the resume model:
//
// - `data-resume-id`: something that can be hidden (sections, jobs, bullets…)
// - `data-resume-container`: its `data-resume-id` children can be reordered
// - `data-resume-text`: its contents can be rewritten
//
// Every render starts by restoring the pristine markup, so it's idempotent.

interface Snapshot {
  text: Map<Element, string>
  order: Map<Element, Element[]>
  title: string
}

const ADDED = 'data-tailor-added'
const MARK = 'tailor-mark'

type ResumeIndex = ReturnType<typeof indexResume>

export class ResumeDom {
  private snapshot: Snapshot
  private baseIndex: ResumeIndex

  constructor(
    private root: HTMLElement,
    private base: ResumeSource
  ) {
    this.baseIndex = indexResume(base)
    this.snapshot = {
      text: new Map(
        [...root.querySelectorAll('[data-resume-text]')].map((el) => [
          el,
          el.innerHTML,
        ])
      ),
      order: new Map(
        [...root.querySelectorAll('[data-resume-container]')].map((el) => [
          el,
          this.children(el),
        ])
      ),
      title: document.title,
    }
  }

  private children(container: Element): Element[] {
    return [...container.children].filter((el) =>
      el.hasAttribute('data-resume-id')
    )
  }

  private all(attribute: string, id: string): HTMLElement[] {
    return [
      ...this.root.querySelectorAll<HTMLElement>(
        `[${attribute}="${CSS.escape(id)}"]`
      ),
    ]
  }

  private restore() {
    for (const mark of this.root.querySelectorAll(`mark.${MARK}`)) {
      const parent = mark.parentNode
      mark.replaceWith(...mark.childNodes)
      parent?.normalize()
    }
    for (const el of this.root.querySelectorAll(`[${ADDED}]`)) {
      el.remove()
    }
    for (const el of this.root.querySelectorAll('[data-tailor-print-shown]')) {
      el.classList.add('print:hidden')
      el.removeAttribute('data-tailor-print-shown')
    }
    for (const [el, html] of this.snapshot.text) {
      el.innerHTML = html
      el.classList.remove('tailor-changed')
    }
    for (const [container, children] of this.snapshot.order) {
      container.append(...children)
    }
    for (const el of this.root.querySelectorAll('[data-resume-id]')) {
      el.classList.remove('tailor-hidden')
      el.removeAttribute('data-tailor-break-before')
    }
    document.title = this.snapshot.title
  }

  render(tailored: Tailored) {
    this.restore()

    const { source } = tailored

    // Sections and their order
    this.reorder(
      'sections',
      source.sections.map((s) => s.id)
    )
    for (const section of source.sections) {
      this.setHidden(section.id, section.hidden)
      const baseSection = this.baseIndex.get(section.id)?.node as
        | { title: string }
        | undefined
      this.setText(`${section.id}:title`, section.title, baseSection?.title)

      if (section.id === 'section:work' || section.id === 'section:education') {
        section.items.forEach((experience) => this.renderExperience(experience))
      } else if (section.id === 'section:skills') {
        section.items.forEach((skill) => this.renderSkill(skill, section.id))
      } else {
        section.items.forEach((activity) =>
          this.renderActivity(activity, section.id)
        )
      }

      this.reorder(
        section.id,
        section.items.map((item) => item.id)
      )
    }

    // Basics
    const { label, tagline, summary } = source.basics
    for (const node of [label, tagline, summary]) {
      this.renderTextNode(node)
    }
    for (const el of this.all('data-resume-id', summary.id)) {
      el.toggleAttribute('data-filled', Boolean(summary.markdown.trim()))
    }

    // Print options
    for (const id of tailored.print.breakBefore) {
      for (const el of this.all('data-resume-id', id)) {
        el.setAttribute('data-tailor-break-before', '')
      }
    }
    const html = document.documentElement
    html.dataset.tailorDensity = tailored.print.density
    html.style.setProperty(
      '--tailor-font-scale',
      String(tailored.print.fontScale)
    )

    this.highlight(tailored.highlightTerms)

    if (tailored.job?.company || tailored.job?.title) {
      document.title = [
        `${source.basics.name} – Resume`,
        [tailored.job.company, tailored.job.title].filter(Boolean).join(' '),
      ].join(' – ')
    }
  }

  private renderExperience(experience: ExperienceNode) {
    this.setHidden(experience.id, experience.hidden)
    const base = this.baseIndex.get(experience.id)?.node as
      | ExperienceNode
      | undefined
    if (experience.printHide === false && base?.printHide) {
      // Put a job that's normally left off the printed resume back in print.
      for (const el of this.all('data-resume-id', experience.id)) {
        el.classList.remove('print:hidden')
        el.setAttribute('data-tailor-print-shown', '')
      }
    }

    const section = this.all('data-resume-id', experience.id)[0]
    if (experience.summary) {
      if (experience.summary.added && section) {
        this.addElement(section, 'p', experience.summary.id, {
          itemprop: 'description',
          class: EXPERIENCE_SUMMARY_CLASS,
        })
      }
      this.renderTextNode(experience.summary)
    }

    const added = experience.highlights.filter((h) => h.added)
    if (added.length && section) {
      const list =
        this.all('data-resume-container', experience.id)[0] ??
        this.addElement(section, 'ul', undefined, {
          itemprop: 'description',
          class: EXPERIENCE_LIST_CLASS,
          'data-resume-container': experience.id,
        })
      added.forEach((highlight) => this.addElement(list, 'li', highlight.id))
    }
    experience.highlights.forEach((highlight) => this.renderTextNode(highlight))
    this.reorder(
      experience.id,
      experience.highlights.map((h) => h.id)
    )
  }

  private renderTextNode(node: TextNode) {
    this.setHidden(node.id, node.hidden)
    const base = this.baseIndex.get(node.id)?.node as TextNode | undefined
    this.setText(node.id, node.markdown, base?.markdown)
  }

  private renderSkill(skill: SkillNode, sectionId: string) {
    if (skill.added) {
      this.appendItem(sectionId, skill.id)
    }
    this.setHidden(skill.id, skill.hidden)

    const base = this.baseIndex.get(skill.id)?.node as SkillNode | undefined
    const html =
      skill.markdown !== undefined
        ? renderInlineMarkdown(skill.markdown)
        : skillLineHtml(skill.lead, skill.keywords)
    const baseHtml = base ? skillLineHtml(base.lead, base.keywords) : undefined

    if (html !== baseHtml) {
      this.writeHtml(skill.id, html, Boolean(base))
    }
  }

  private renderActivity(activity: ActivityNode, sectionId: string) {
    if (activity.added) {
      const li = this.appendItem(sectionId, activity.id, false)
      if (li) {
        this.addElement(li, 'span', undefined, {
          'data-resume-text': activity.id,
        })
      }
    }
    this.setHidden(activity.id, activity.hidden)
    const base = this.baseIndex.get(activity.id)?.node as
      | ActivityNode
      | undefined
    this.setText(activity.id, activity.markdown, base?.markdown)
  }

  /** Creates an element that `restore()` removes again. */
  private addElement(
    parent: Element,
    tag: string,
    id: string | undefined,
    attributes: Record<string, string> = {}
  ): HTMLElement {
    const el = document.createElement(tag)
    el.setAttribute(ADDED, '')
    if (id) {
      el.dataset.resumeId = id
      el.dataset.resumeText = id
    }
    for (const [name, value] of Object.entries(attributes)) {
      el.setAttribute(name, value)
    }
    parent.append(el)
    return el
  }

  /** Adds an `<li>` for a new item to a container. */
  private appendItem(
    containerId: string,
    id: string,
    isText = true
  ): HTMLElement | undefined {
    const container = this.all('data-resume-container', containerId)[0]
    if (!container) return undefined
    const el = this.addElement(container, 'li', isText ? id : undefined, {
      'data-print-unit': id,
    })
    el.dataset.resumeId = id
    return el
  }

  private setHidden(id: string, hidden: boolean | undefined) {
    for (const el of this.all('data-resume-id', id)) {
      el.classList.toggle('tailor-hidden', Boolean(hidden))
    }
  }

  private setText(id: string, markdown: string, baseMarkdown?: string) {
    if (markdown === baseMarkdown) {
      return
    }
    this.writeHtml(
      id,
      renderInlineMarkdown(markdown),
      baseMarkdown !== undefined
    )
  }

  /** Writes new content, keeping the original around for review mode. */
  private writeHtml(id: string, html: string, hasOriginal: boolean) {
    for (const el of this.all('data-resume-text', id)) {
      const original = this.snapshot.text.get(el)
      el.classList.add('tailor-changed')
      el.innerHTML =
        hasOriginal && original
          ? `<del class="tailor-del">${original}</del> <ins class="tailor-ins">${html}</ins>`
          : `<ins class="tailor-ins">${html}</ins>`
    }
  }

  private reorder(containerId: string, ids: string[]) {
    for (const container of this.all('data-resume-container', containerId)) {
      const byId = new Map(
        this.children(container).map((el) => [
          el.getAttribute('data-resume-id'),
          el,
        ])
      )
      const ordered = ids
        .map((id) => byId.get(id))
        .filter((el): el is Element => Boolean(el))
      container.append(...ordered)
    }
  }

  private highlight(terms: string[]) {
    const words = terms.map((t) => t.trim()).filter(Boolean)
    if (!words.length) return

    const pattern = new RegExp(
      `\\b(${words.map(escapeRegExp).join('|')})(?![\\w])`,
      'gi'
    )
    const walker = document.createTreeWalker(this.root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest('del, script, style, mark, h2, header')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    })

    const nodes: Text[] = []
    while (walker.nextNode()) nodes.push(walker.currentNode as Text)

    for (const node of nodes) {
      const text = node.data
      pattern.lastIndex = 0
      if (!pattern.test(text)) continue
      pattern.lastIndex = 0

      const fragment = document.createDocumentFragment()
      let last = 0
      for (const match of text.matchAll(pattern)) {
        const start = match.index ?? 0
        fragment.append(text.slice(last, start))
        const mark = document.createElement('mark')
        mark.className = MARK
        mark.textContent = match[0]
        fragment.append(mark)
        last = start + match[0].length
      }
      fragment.append(text.slice(last))
      node.replaceWith(fragment)
    }
  }
}
