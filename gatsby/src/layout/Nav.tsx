import React, { useState } from 'react'
import tw, { styled, css, theme } from 'twin.macro'
import { useMedia, useWindowScroll } from 'react-use'
import { Link } from 'gatsby'

import UserLinks from '../components/UserLinks/UserLinks'
import { PaperStyles } from '../components/Shared/Paper'
import EmojiText from '../components/Shared/EmojiText'

interface NavProps {
  mobile?: boolean
  expanded?: boolean
  scrolledPastHeader?: boolean
  wider?: boolean
}

const NavContainer = styled.nav<NavProps>`
  position: fixed;
  top: ${props => (props.scrolledPastHeader ? '.5em' : '3em')};
  right: 7%;
  align-self: center;
  z-index: 99;

  ${tw`font-mono`}

  // On mobile, hide by default
  ${tw`xs:hidden sm:hidden md:hidden lg:block xl:block 2xl:block`}

  // But once expanded, show it
  ${props => props.expanded && tw`xs:hidden sm:block md:block`}

  // @media (min-width: ${theme`screens.xl`}) {
  //   right: 60%;
  // }

  ${props =>
    props.wider &&
    css`
      left: 80%;
    `}

  & .nav-links {
    ${tw`
      flex
      flex-col
    `}

    & > .user-links {
      ${tw`mt-4`}
    }
  }

  & .nav-page-link {
    margin-right: 1em;

    ${tw`
      no-underline 
      hover:no-underline 
      focus:no-underline
      text-teal-500
    `}

    & > .link-text {
      ${tw`p-1`}
    }

    &:hover > .link-text,
    &:focus > .link-text {
      ${tw`underline`}

      &:last-child {
        ${tw`mb-4`}
      }
    }

    & > .emoji {
      ${tw`mr-2`}
    }
  }

  @media print {
    display: none;
  }

  ${props =>
    !props.mobile &&
    css`
      ${PaperStyles}
    `}

  ${props =>
    props.mobile &&
    !props.expanded &&
    css`
      & .nav-links {
        display: none;
      }
    `}

  ${props =>
    props.mobile &&
    props.expanded &&
    css`
      position: fixed;
      z-index: 10000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);

      & > .nav-links {
        height: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      }

      & .nav-page-link {
        font-size: 2em;
        margin-right: 0;
      }
    `}
`

const Hamburger = styled.button`
  position: fixed;
  font-size: 2em;
  text-decoration: none;
  right: 0.75em;
  top: 0;
  z-index: 10001;

  ${tw`xs:block sm:block md:block lg:hidden xl:hidden 2xl:hidden print:hidden`}

  &:hover,
  &:focus {
    text-shadow: 0px 0px 5px #e172da;
    ${tw`transition-all ease-linear duration-200`}
  }
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

const Nav: React.FC<Pick<NavProps, 'wider'>> = ({ wider = false }) => {
  const [hamburgerExpanded, setHamburgerExpanded] = useState(false)
  const showHamburger = useMedia('(max-width: 1024px)', false)
  const { y: scrollY } = useWindowScroll()

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
        mobile={showHamburger}
        onClick={() => hamburgerExpanded && setHamburgerExpanded(false)}
        scrolledPastHeader={showHamburger || scrollY >= 32}
        wider={wider}
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
          <UserLinks />
        </div>
      </NavContainer>
    </>
  )
}

export default Nav
