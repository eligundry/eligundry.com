/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import tw, { styled } from 'twin.macro'
import Link from 'next/link'
import useDarkMode from 'use-dark-mode'
import { useRouter } from 'next/router'

import EmojiText from '@/components/Shared/EmojiText'

interface NavProps {
  expanded: boolean
}

const NavContainer = styled.nav<NavProps>`
  ${tw`
    w-auto 
    flex-grow 
    lg:flex 
    lg:items-center 
    lg:flex 
    lg:bg-transparent
    sm:text-lg
    sm:w-full
    z-20 
    font-sans
    print:hidden
  `}

  & .nav-links {
    ${tw`
      flex 
      flex-row
      sm:flex-col
      justify-end 
      flex-1 
      items-center 
      sm:items-start
    `}

    & a {
      ${tw`
        inline-block 
        text-typographyLite
        dark:text-white
        no-underline 
        hover:text-primary
        py-2 
        px-4
        sm:px-0
        sm:w-full
      `}

      &[aria-current='page'] {
        ${tw`font-bold text-primary`}
      }
    }
  }

  ${(props) => !props.expanded && tw`sm:hidden`}
`

const Hamburger = styled.button`
  ${tw`
    block 
    md:hidden
    lg:hidden 
    flex 
    items-center 
    appearance-none 
    focus:outline-none
    print:hidden
    absolute
    text-2xl
    top-4
    right-4
  `}
`

const ThemeToggle = styled.button`
  ${tw`
    focus:outline-none
    sm:absolute
    sm:top-4
    sm:right-12
    sm:text-2xl
    print:hidden
    lg:pl-2
  `}
`

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
      <Hamburger
        aria-label={`${hamburgerExpanded ? 'close' : 'open'} the nav menu`}
        onClick={() => setHamburgerExpanded((exp) => !exp)}
      >
        {hamburgerExpanded ? '🙅' : '🍔'}
      </Hamburger>
      <NavContainer
        role="navigation"
        expanded={hamburgerExpanded}
        onClick={() => hamburgerExpanded && setHamburgerExpanded(false)}
      >
        <div className="nav-links">
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
      </NavContainer>
      <ThemeToggle
        onClick={toggleDarkMode}
        aria-label={`switch to the ${
          darkMode ? 'dark' : 'light'
        } theme for the site`}
        data-gtm="theme-toggle"
      >
        {darkMode ? '🌚' : '🌞'}
      </ThemeToggle>
    </>
  )
}

export default Nav
