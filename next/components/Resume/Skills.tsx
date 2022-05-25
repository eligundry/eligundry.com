import React from 'react'
import clsx from 'clsx'

import { Skills } from './data'

interface SkillsItemProps {
  prefix: string | React.ReactNode
  keywords: Record<string, string>
}

const SkillsItem: React.FC<SkillsItemProps> = ({ prefix, keywords }) => {
  const entries = Object.entries(keywords)

  return (
    <li>
      {prefix}{' '}
      {entries.map(([keyword, url], idx) => {
        const isLastKeyword = idx + 1 === entries.length
        const isSecondToLastKeyWord = idx + 2 === entries.length
        const insertComma = !isLastKeyword && !isSecondToLastKeyWord

        return (
          <React.Fragment key={url}>
            {isLastKeyword && '& '}
            <a href={url} itemProp="knowsAbout">
              {keyword}
            </a>
            {insertComma && ','}
            {!isLastKeyword && ' '}
          </React.Fragment>
        )
      })}
      .
    </li>
  )
}

interface SkillsSectionProps {
  skills: Skills[]
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const languages = skills.find((s) => s.name === 'Languages')
  const frameworks = skills.find((s) => s.name === 'Frameworks')
  const tools = skills.find((s) => s.name === 'Tools')
  const loveHate = skills.find((s) => s.name === 'Love Hate')

  return (
    <section>
      <header>
        <h2>Skills & Technologies</h2>
      </header>
      <ul className={clsx('pl-0', 'mt-0', 'pb-4')}>
        {languages?.keywords && (
          <SkillsItem prefix="Fluent in" keywords={languages.keywords} />
        )}
        {frameworks?.keywords && (
          <SkillsItem
            prefix="Built complex web applications using"
            keywords={frameworks.keywords}
          />
        )}
        {tools?.keywords && (
          <SkillsItem prefix="Loves using" keywords={tools.keywords} />
        )}
        {loveHate?.keywords && (
          <SkillsItem
            prefix="Has a love-hate relationship (that I will happily explain) with"
            keywords={loveHate.keywords}
          />
        )}
      </ul>
    </section>
  )
}

export default SkillsSection
