import React from 'react'

import { Skills } from './data'

interface SkillsItemProps {
  prefix: string
  keywords: { [keyword: string]: string }
}

const SkillsItem: React.FC<SkillsItemProps> = ({ prefix, keywords }) => {
  const entries = Object.entries(keywords)

  return (
    <li>
      {prefix}{' '}
      {entries.map(([keyword, url], idx) => {
        return (
          <React.Fragment key={url}>
            {idx + 1 === entries.length && '& '}
            <a href={url}>{keyword}</a>
            {idx + 1 < entries.length && ', '}
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
  const languages = skills.find(s => s.name === 'Languages')
  const frameworks = skills.find(s => s.name === 'Frameworks')
  const tools = skills.find(s => s.name === 'Tools')
  const loveHate = skills.find(s => s.name === 'Love Hate')

  return (
    <section>
      <h2>Skills</h2>
      <ul>
        <SkillsItem prefix="Fluent in" keywords={languages.keywords} />
        <SkillsItem
          prefix="Built web applications using"
          keywords={frameworks.keywords}
        />
        <SkillsItem prefix="Loves using" keywords={tools.keywords} />
        <SkillsItem
          prefix="Has a love hate relationship (that I will happily explain) with"
          keywords={loveHate.keywords}
        />
      </ul>
    </section>
  )
}

export default SkillsSection
