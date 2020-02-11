import React from 'react'
import styled from 'styled-components'

const Nav = styled.nav`
  & > a {
    margin-right: 1em;
  }
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
    <header>
      <h1>Eli Gundry</h1>
      <Nav role="navigation">
        {Object.entries(navLinks).map(([path, title]) => (
          <a href={path}>{title}</a>
        ))}
      </Nav>
    </header>
  )
}

export default Header
