import React from 'react'
import useMedia from 'react-use/lib/useMedia'
import useSearchParam from 'react-use/lib/useSearchParam'
import { FaExternalLinkAlt } from 'react-icons/fa'

import Experience from './Experience'
import { Work } from './data'

interface WorkProps {
  work: Work[]
}

const WorkSection: React.FC<WorkProps> = ({ work }) => {
  const isPrinting = useMedia('print')
  const targetedEmployer = useSearchParam('employer')
  const targeting = new URLSearchParams({
    utm_source: 'resume',
    utm_medium: 'view-full-resume',
    utm_campaign: targetedEmployer || 'none',
  })

  return (
    <section>
      {!isPrinting && (
        <header>
          <h2>Work</h2>
        </header>
      )}
      {isPrinting && (
        <header>
          <h2>Selected Work History</h2>
          <span>
            Full resume at{' '}
            <a href={`/resume?${targeting.toString()}`}>
              eligundry.com/resume <FaExternalLinkAlt fontSize=".75em" />
            </a>
          </span>
        </header>
      )}
      {work
        .filter(w => !isPrinting || !w.printHide)
        .map(w => (
          <Experience
            key={w.company}
            variant="work"
            name={w.company}
            url={w.website}
            startDate={w.startDate}
            endDate={w.endDate}
            position={w.position}
            location={w.location}
            summary={w.summary}
            highlights={w.highlights}
          />
        ))}
    </section>
  )
}

export default WorkSection
