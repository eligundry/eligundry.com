import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { useIsPrinting } from '@/hooks/useMediaQuery'
import Experience from './Experience'
import { Work } from './data'
import {
  useParseOptimizedFlag,
  useJobSearchParams,
  useFullResumeToggle,
} from './hooks'

interface WorkProps {
  work: Work[]
}

const WorkSection: React.FC<WorkProps> = ({ work }) => {
  const isPrinting = useIsPrinting()
  const parseOptimized = useParseOptimizedFlag()
  const printFullResume = useFullResumeToggle()
  const targeting = useJobSearchParams({ content: 'view-full-resume' })

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
          <span className="full-work-cta">
            Full resume at{' '}
            <a href={`/resume?${targeting.toString()}`}>
              eligundry.com/resume{' '}
              {!parseOptimized && <FaExternalLinkAlt fontSize=".75em" />}
            </a>
          </span>
        </header>
      )}
      {work
        .filter((w) => !isPrinting || !w.printHide || printFullResume)
        .map((w) => (
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
