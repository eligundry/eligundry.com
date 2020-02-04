import React from 'react'

const navLinks = {
  '/': 'Home',
  '/blog': 'Blog',
  '/feelings': 'Feelings',
  '/resume': 'Resume',
}

const Header: React.FC = () => {
  return (
    <header>
      <h1>Eli Gundry</h1>
      <nav role="navigation">
        {Object.entries(navLinks).map(([path, title]) => (
          <a href={path}>{title}</a>
        ))}
      </nav>
    </header>
  )
}

export default Header
