import React, { useState } from 'react'
import tw, { styled, css } from 'twin.macro'
import { Link } from 'gatsby'
import useLocation from 'react-use/lib/useLocation'

import EmojiText from '../components/Shared/EmojiText'

interface NavProps {
  expanded: boolean
  activePath: string | undefined
}

const NavContainer = styled.nav<NavProps>`
  ${tw`
    w-full 
    flex-grow 
    lg:flex 
    lg:items-center 
    lg:w-auto 
    lg:block 
    mt-2 
    lg:mt-0 
    md:bg-transparent 
    z-20 
    font-sans
    print:hidden
  `}

  & .nav-links {
    ${tw`lg:flex justify-end flex-1 items-center`}

    & a {
      ${tw`
        inline-block 
        text-typographyLite
        no-underline 
        hover:text-primary
        py-2 
        px-4
      `}

      ${props =>
        props.activePath &&
        css`
        &[href="${props.activePath}"] {
          ${tw`font-bold text-primary`}
        }
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
    print:hidden
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
  const { pathname } = useLocation()

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
        activePath={pathname}
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
