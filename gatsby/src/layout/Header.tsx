import React, { useState } from 'react'
import tw, { styled, css } from 'twin.macro'
import { useWindowSize } from 'react-use'

import style from '../../data/styleConfig'
import UserLinks from 'src/components/UserLinks/UserLinks'

const HeaderElm = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & h1 {
    margin: 0.25em 0;
  }
`

interface NavProps {
  mobile?: boolean
  expanded?: boolean
}

const Nav = styled.nav<NavProps>`
  position: fixed;
  right: 0;
  align-self: center;
  z-index: 10000;

  & .nav-page-link {
    margin-right: 1em;
    ${tw`no-underline`}
  }

  & > .hamburger {
    font-size: 2em;
    text-decoration: none;
  }

  @media print {
    display: none;
  }

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

      & > .hamburger {
        position: absolute;
        top: 0;
        right: 0;
      }

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

const navLinks = {
  '/': {
    title: 'Home',
    emoji: '🏠',
    emojiLabel: 'little house to denote the home page',
  },
  '/blog/': {
    title: 'Blog',
    emoji: '📝',
    emojiLabel: 'note to denote my blog',
  },
  '/feelings/': {
    title: 'Feelings',
    emoji: '🥺',
    emojiLabel: 'emotional looking emoji face to denote my feelings',
  },
  '/talks/': {
    title: 'Talks',
    emoji: '🗣',
    emojiLabel: 'silhouette of person speaking',
  },
  '/resume/': {
    title: 'Resume',
    emoji: '📄',
    emojiLabel: 'piece of paper representing my resume',
  },
}

const Header: React.FC = () => {
  const { width } = useWindowSize()
  const [hamburgerExpanded, setHamburgerExpanded] = useState(false)
  const showHamburger = width <= style.breakPoints.tabletPx

  return (
    <>
      <HeaderElm>
        <h1>
          <a rel="root" href="/">
            Eli Gundry
          </a>
        </h1>
        <Nav
          role="navigation"
          expanded={hamburgerExpanded}
          mobile={showHamburger}
          onClick={() => hamburgerExpanded && setHamburgerExpanded(false)}
        >
          {showHamburger && (
            <a
              className="hamburger"
              href="#menu"
              aria-label={`${
                hamburgerExpanded ? 'close' : 'open'
              } the nav menu`}
              onClick={e => {
                e.preventDefault()
                setHamburgerExpanded(exp => !exp)
              }}
            >
              {hamburgerExpanded ? '🙅' : '🍔'}
            </a>
          )}
          <div className="nav-links">
            {Object.entries(navLinks).map(
              ([path, { title, emoji, emojiLabel }]) => (
                <a
                  href={path}
                  key={path}
                  onClick={() => setHamburgerExpanded(false)}
                  className="nav-page-link"
                >
                  <span role="img" aria-label={emojiLabel}>
                    {emoji}
                  </span>
                  {title}
                </a>
              )
            )}
            <UserLinks />
          </div>
        </Nav>
      </HeaderElm>
    </>
  )
}

export default Header
