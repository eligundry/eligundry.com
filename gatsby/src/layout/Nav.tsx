import React, { useState } from 'react'
import tw, { styled } from 'twin.macro'
import { Link } from 'gatsby'

import EmojiText from '../components/Shared/EmojiText'

interface NavProps {
  expanded: boolean
}

const NavContainer = styled.nav<NavProps>`
  ${tw`
    w-auto 
    flex-grow 
    lg:flex 
    lg:items-center 
    lg:block 
    sm:bg-white
    lg:bg-transparent
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
        no-underline 
        hover:text-primary
        py-2 
        px-4
        sm:px-0
      `}

      &[aria-current="page"] {
        ${tw`font-bold text-primary`}
      }
    }
  }

  ${props => !props.expanded && tw`sm:hidden`}
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
  `}

  right: 1rem;
  top: 1rem;
`

const navLinks = {
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
}

const Nav: React.FC = () => {
  const [hamburgerExpanded, setHamburgerExpanded] = useState(false)

  return (
    <>
      <Hamburger
        aria-label={`${hamburgerExpanded ? 'close' : 'open'} the nav menu`}
        onClick={() => setHamburgerExpanded(exp => !exp)}
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
              <Link
                to={path}
                key={path}
                onClick={() => setHamburgerExpanded(false)}
                className="nav-page-link"
              >
                <EmojiText label={emojiLabel} emoji={emoji}>
                  <span className="link-text">{title}</span>
                </EmojiText>
              </Link>
            )
          )}
        </div>
      </NavContainer>
    </>
  )
}

export default Nav
