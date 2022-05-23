import React from 'react'
import Link from 'next/link'
import useWindowScroll from 'react-use/lib/useWindowScroll'
import useWindowSize from 'react-use/lib/useWindowSize'

import useDocument from '@/components/Shared/useDocument'
import Nav from './Nav'
import styles from './Header.module.scss'

const Header: React.FC = () => {
  const { y } = useWindowScroll()
  const { height } = useWindowSize()
  const document = useDocument()

  return (
    <header className={styles.header}>
      <progress
        className={styles.progressBar}
        max={
          height !== Infinity
            ? Math.max(document?.body?.clientHeight ?? 0, height + 1) - height
            : undefined
        }
        value={y}
        aria-label="your scroll progress through the page"
      />
      <div className="wrapper">
        <h1 itemProp="name">
          <Link href="/">
            <a itemProp="sameAs">Eli Gundry</a>
          </Link>
        </h1>
        <Nav />
      </div>
    </header>
  )
}

export default Header
