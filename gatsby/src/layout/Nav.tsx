import React, { useState } from 'react'
import tw, { styled } from 'twin.macro'
import { Link } from 'gatsby'

import UserLinks from '../components/UserLinks/UserLinks'
import EmojiText from '../components/Shared/EmojiText'

interface NavProps {
  expanded: boolean
}

const NavContainer = styled.nav<NavProps>`
  ${tw`w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block mt-2 lg:mt-0 bg-gray-100 md:bg-transparent z-20 font-sans`}

  & .nav-links {
    ${tw`lg:flex justify-end flex-1 items-center`}

    & a {
      ${tw`
        inline-block 
        text-gray-600 
        no-underline 
        hover:text-primary
        py-2 
        px-4
      `}
    }
  }

  ${props => !props.expanded && tw`hidden`}
`

const Hamburger = styled.button`
  ${tw`
    block 
    lg:hidden 
    pr-4 
    flex 
    items-center 
    appearance-none 
    focus:outline-none
  `}
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
          {/* <UserLinks /> */}
        </div>
      </NavContainer>
    </>
  )
}

export default Nav
