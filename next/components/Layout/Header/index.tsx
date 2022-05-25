import React from 'react'
import Link from 'next/link'
import useWindowScroll from 'react-use/lib/useWindowScroll'
import useWindowSize from 'react-use/lib/useWindowSize'

import useDocument from '@/hooks/useDocument'
import Nav from '@/components/Layout/Nav'
import styles from './index.module.scss'

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
