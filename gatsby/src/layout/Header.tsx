import React from 'react'
import styled from 'styled-components'

const HeaderElm = styled.header`
  & h1 {
    margin: 0.25em 0;
  }
`

const Nav = styled.nav`
  & > a {
    margin-right: 1em;
  }

  @media print {
    display: none;
  }
`

const BetaBanner = styled.h6`
  margin-bottom: 0.25em;
`

const navLinks = {
  '/': 'Home',
  '/blog': 'Blog',
  '/feelings': 'Feelings',
  '/talks': 'Talks',
  '/resume': 'Resume',
}

const Header: React.FC = () => {
  return (
    <>
      <BetaBanner>
        <strong>Beta:</strong> I am developing this site in the open. Please
        excuse my mess while I figure out styles.
      </BetaBanner>
      <HeaderElm>
        <h1>Eli Gundry</h1>
        <Nav role="navigation">
          {Object.entries(navLinks).map(([path, title]) => (
            <a href={path} key={path}>
              {title}
            </a>
          ))}
        </Nav>
      </HeaderElm>
    </>
  )
}

export default Header
