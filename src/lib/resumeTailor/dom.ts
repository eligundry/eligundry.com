import {
  indexResume,
  type ActivityNode,
  type ExperienceNode,
  type ResumeSource,
  type SkillNode,
  type TextNode,
} from '../resume/model'
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

export class ResumeDom {
  private snapshot: Snapshot

  constructor(
    private root: HTMLElement,
    private base: ResumeSource
  ) {
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
    for (const [el, html] of this.snapshot.text) {
      el.innerHTML = html
      el.classList.remove('tailor-changed')
    }
    for (const [container, children] of this.snapshot.order) {
      container.append(...children)
    }
    for (const el of this.root.querySelectorAll('[data-resume-id]')) {
      el.classList.remove('tailor-hidden', 'tailor-force-print')
      el.removeAttribute('data-tailor-break-before')
    }
    document.title = this.snapshot.title
  }

  render(tailored: Tailored) {
    this.restore()

    const { source } = tailored
    const baseIndex = indexResume(this.base)

    // Sections and their order
    this.reorder(
      'sections',
      source.sections.map((s) => s.id)
    )
    for (const section of source.sections) {
      this.setHidden(section.id, section.hidden)
      this.setText(
        `${section.id}:title`,
        section.title,
        this.base.sections.find((s) => s.id === section.id)?.title
      )

      if (section.id === 'section:work' || section.id === 'section:education') {
        for (const experience of section.items) {
          this.renderExperience(experience, baseIndex)
        }
      } else if (section.id === 'section:skills') {
        for (const skill of section.items) {
          this.renderSkill(skill, section.id)
        }
      } else {
        for (const activity of section.items) {
          this.renderActivity(activity, section.id, baseIndex)
        }
      }

      this.reorder(
        section.id,
        section.items.map((item) => item.id)
      )
    }

    // Basics
    const { label, tagline, summary } = source.basics
    this.setText(label.id, label.markdown, this.base.basics.label.markdown)
    this.setText(
      tagline.id,
      tagline.markdown,
      this.base.basics.tagline.markdown
    )
    this.setText(
      summary.id,
      summary.markdown,
      this.base.basics.summary.markdown
    )
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

  private renderExperience(
    experience: ExperienceNode,
    baseIndex: ReturnType<typeof indexResume>
  ) {
    this.setHidden(experience.id, experience.hidden)
    const baseExperience = baseIndex.get(experience.id)?.node as
      | ExperienceNode
      | undefined
    if (experience.printHide === false && baseExperience?.printHide) {
      for (const el of this.all('data-resume-id', experience.id)) {
        el.classList.add('tailor-force-print')
      }
    }

    if (experience.summary) {
      if (experience.summary.added) {
        const section = this.all('data-resume-id', experience.id)[0]
        const p = document.createElement('p')
        p.setAttribute('itemprop', 'description')
        p.className = 'order-5 my-2'
        p.setAttribute(ADDED, '')
        p.dataset.resumeId = experience.summary.id
        p.dataset.resumeText = experience.summary.id
        section?.append(p)
      }
      this.renderTextNode(experience.summary, baseIndex)
    }

    if (experience.highlights.some((h) => h.added)) {
      this.ensureList(experience.id)
    }
    for (const highlight of experience.highlights) {
      if (highlight.added) {
        const li = document.createElement('li')
        li.setAttribute(ADDED, '')
        li.dataset.resumeId = highlight.id
        li.dataset.resumeText = highlight.id
        this.all('data-resume-container', experience.id)[0]?.append(li)
      }
      this.renderTextNode(highlight, baseIndex)
    }
    this.reorder(
      experience.id,
      experience.highlights.map((h) => h.id)
    )
  }

  private ensureList(experienceId: string) {
    if (this.all('data-resume-container', experienceId).length) {
      return
    }
    const section = this.all('data-resume-id', experienceId)[0]
    const ul = document.createElement('ul')
    ul.setAttribute('itemprop', 'description')
    ul.className = 'order-5 my-0'
    ul.setAttribute(ADDED, '')
    ul.dataset.resumeContainer = experienceId
    section?.append(ul)
  }

  private renderTextNode(
    node: TextNode,
    baseIndex: ReturnType<typeof indexResume>
  ) {
    this.setHidden(node.id, node.hidden)
    const base = baseIndex.get(node.id)?.node as TextNode | undefined
    this.setText(node.id, node.markdown, base?.markdown)
  }

  private renderSkill(skill: SkillNode, sectionId: string) {
    if (skill.added) {
      this.appendItem(sectionId, skill.id, 'li')
    }
    this.setHidden(skill.id, skill.hidden)

    const base = indexResume(this.base).get(skill.id)?.node as
      | SkillNode
      | undefined
    const html =
      skill.markdown !== undefined
        ? renderInlineMarkdown(skill.markdown)
        : skillLineHtml(skill.lead, skill.keywords)
    const baseHtml = base ? skillLineHtml(base.lead, base.keywords) : undefined

    if (html !== baseHtml) {
      this.writeHtml(skill.id, html, Boolean(base))
    }
  }

  private renderActivity(
    activity: ActivityNode,
    sectionId: string,
    baseIndex: ReturnType<typeof indexResume>
  ) {
    if (activity.added) {
      const li = this.appendItem(sectionId, activity.id, 'li', false)
      const span = document.createElement('span')
      span.dataset.resumeText = activity.id
      li?.append(span)
    }
    this.setHidden(activity.id, activity.hidden)
    const base = baseIndex.get(activity.id)?.node as ActivityNode | undefined
    this.setText(activity.id, activity.markdown, base?.markdown)
  }

  private appendItem(
    containerId: string,
    id: string,
    tag: string,
    isText = true
  ): HTMLElement | undefined {
    const container = this.all('data-resume-container', containerId)[0]
    if (!container) return undefined
    const el = document.createElement(tag)
    el.setAttribute(ADDED, '')
    el.dataset.resumeId = id
    el.dataset.printUnit = id
    if (isText) {
      el.dataset.resumeText = id
    }
    container.append(el)
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
      `\\b(${words
        .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')})(?![\\w])`,
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
