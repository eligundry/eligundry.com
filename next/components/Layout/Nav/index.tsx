/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import Link from 'next/link'
import useDarkMode from 'use-dark-mode'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import EmojiText from '@/components/Shared/EmojiText'
import styles from './index.module.scss'

const navLinks = Object.freeze({
  '/': {
    title: 'Home',
    emoji: '🏠',
    emojiLabel: 'little house to denote the home page',
  },
  '/blog': {
    title: 'Blog',
    emoji: '📝',
    emojiLabel: 'note to denote my blog',
  },
  '/feelings': {
    title: 'Feelings',
    emoji: '🥺',
    emojiLabel: 'emotional looking emoji face to denote my feelings',
  },
  '/talks': {
    title: 'Talks',
    emoji: '🗣',
    emojiLabel: 'silhouette of person speaking',
  },
  '/resume': {
    title: 'Resume',
    emoji: '📄',
    emojiLabel: 'piece of paper representing my resume',
  },
})

const Nav: React.FC = () => {
  const [hamburgerExpanded, setHamburgerExpanded] = useState(false)
  const { value: darkMode, toggle: toggleDarkMode } = useDarkMode()
  const { pathname: currentPath } = useRouter()

  return (
    <>
      <button
        aria-label={`${hamburgerExpanded ? 'close' : 'open'} the nav menu`}
        onClick={() => setHamburgerExpanded((exp) => !exp)}
        className={styles.hamburger}
        type="reset"
      >
        {hamburgerExpanded ? '🙅' : '🍔'}
      </button>
      <nav
        role="navigation"
        className={clsx(
          styles.nav,
          !hamburgerExpanded && styles.navNotExpanded
        )}
      >
        <div className={styles.navLinks}>
          {Object.entries(navLinks).map(
            ([path, { title, emoji, emojiLabel }]) => (
              <Link href={path} key={path}>
                <a
                  onClick={() => setHamburgerExpanded(false)}
                  className="nav-page-link"
                  aria-current={currentPath === path ? 'page' : undefined}
                >
                  <EmojiText label={emojiLabel} emoji={emoji}>
                    <span className="link-text">{title}</span>
                  </EmojiText>
                </a>
              </Link>
            )
          )}
        </div>
      </nav>
      <button
        onClick={toggleDarkMode}
        aria-label={`switch to the ${
          darkMode ? 'dark' : 'light'
        } theme for the site`}
        data-gtm="theme-toggle"
        className={styles.themeToggle}
        type="reset"
      >
        {darkMode ? '🌚' : '🌞'}
      </button>
    </>
  )
}

export default Nav
