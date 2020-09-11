import React from 'react'
import { useMedia } from 'react-use'

import Experience from './Experience'
import { Work } from './data'

interface WorkProps {
  work: Work[]
}

const WorkSection: React.FC<WorkProps> = ({ work }) => {
  const isPrinting = useMedia('print')

  return (
    <section>
      {!isPrinting && <h2>Work</h2>}
      {isPrinting && (
        <header>
          <h2>Selected Work History</h2>
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
